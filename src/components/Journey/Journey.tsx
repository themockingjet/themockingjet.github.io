import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Journey.module.css'

const destinations = [
  { id: 'hero', label: 'Home' }, { id: 'route', label: 'Your route' },
  { id: 'projects', label: 'Projects' }, { id: 'lab', label: 'The lab' },
  { id: 'about', label: 'About' }, { id: 'contact', label: 'Contact' },
] as const

export default function Journey({ children }: { children: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const lastWheel = useRef(0)

  const show = useCallback((index: number, hash = true) => {
    const next = Math.max(0, Math.min(destinations.length - 1, index))
    if (next !== currentRef.current) window.dispatchEvent(new Event('journey-travel'))
    currentRef.current = next
    setCurrent(next)
    const panel = track.current?.children[next] as HTMLElement | undefined
    if (track.current && panel) track.current.scrollTo({ left: panel.offsetLeft, behavior: 'auto' })
    if (hash && location.hash !== `#${destinations[next].id}`) history.pushState(null, '', `#${destinations[next].id}`)
  }, [])

  useEffect(() => {
    const followHash = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      const target = document.getElementById(id)
      const panel = target?.closest('[data-destination]') as HTMLElement | null
      const index = id === 'skills' ? 4 : destinations.findIndex((destination) => destination.id === (panel?.dataset.destination ?? id))
      if (index >= 0) {
        show(index, false)
        if (target && target !== panel && id !== destinations[index].id) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'auto' }))
      }
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    window.addEventListener('popstate', followHash)
    return () => { window.removeEventListener('hashchange', followHash); window.removeEventListener('popstate', followHash) }
  }, [show])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.target as HTMLElement).closest('input, textarea, select, button, a, [contenteditable="true"]')) return
      const next = event.key === 'ArrowRight' ? currentRef.current + 1 : event.key === 'ArrowLeft' ? currentRef.current - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? destinations.length - 1 : -1
      if (next >= 0) { event.preventDefault(); show(next) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [show])

  useEffect(() => {
    const element = track.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || (event.target as HTMLElement).closest('input, select, textarea')) return
      const panel = element.children[currentRef.current] as HTMLElement
      const vertical = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
      if (vertical && ((event.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2) || (event.deltaY < 0 && panel.scrollTop > 0))) return
      const delta = vertical ? event.deltaY : event.deltaX
      if (Math.abs(delta) < 5) return
      event.preventDefault()
      if (Date.now() - lastWheel.current < 600) return
      lastWheel.current = Date.now()
      show(currentRef.current + Math.sign(delta))
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [show])

  return <>
    <main ref={track} className={styles.track} onScroll={(event) => {
      const element = event.currentTarget
      const index = Math.max(0, Math.min(destinations.length - 1, Math.round(element.scrollLeft / element.clientWidth)))
      if (index !== currentRef.current) {
        currentRef.current = index
        setCurrent(index)
        history.replaceState(null, '', `#${destinations[index].id}`)
      }
    }}>
      {destinations.map((destination, index) => <div key={destination.id} id={destination.id} data-destination={destination.id} className={styles.panel} tabIndex={0} aria-label={`${destination.label} destination`}>{children[index]}</div>)}
    </main>
    <nav className={styles.itinerary} aria-label="Journey destinations">
      <div className={styles.position} aria-hidden="true"><span>{String(current + 1).padStart(2, '0')} / 06</span><strong>{destinations[current].label}</strong></div>
      <button onClick={() => show(current - 1)} disabled={current === 0} aria-label="Previous destination">←</button>
      {destinations.map((destination, index) => <a key={destination.id} href={`#${destination.id}`} onClick={(event) => { event.preventDefault(); show(index) }} aria-current={current === index ? 'location' : undefined}><span aria-hidden="true" className={styles.planet} /><span>{destination.label}</span></a>)}
      <button onClick={() => show(current + 1)} disabled={current === destinations.length - 1} aria-label="Next destination">→</button>
    </nav>
  </>
}
