import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'
import styles from './Journey.module.css'

const destinations = [
  { id: 'hero', label: 'Home' }, { id: 'projects', label: 'Projects' }, { id: 'lab', label: 'The lab' },
  { id: 'about', label: 'About' }, { id: 'contact', label: 'Contact' },
] as const

export type JourneyTravel = { hops: number; duration: number }
const travelTime = (hops: number) => Math.min(1.1, .65 + .12 * (Math.abs(hops) - 1))
const prefersReducedMotion = () => typeof window.matchMedia !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Journey({ children }: { children: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const lastWheel = useRef(0)
  const blur = useRef<SVGFEGaussianBlurElement>(null)
  const glide = useRef<gsap.core.Tween | null>(null)

  const settle = useCallback((element: HTMLElement, left: number) => {
    glide.current?.kill()
    glide.current = null
    element.scrollLeft = left
    delete element.dataset.travelling
    blur.current?.setAttribute('stdDeviation', '0 0')
  }, [])

  // The track really scrolls to the next panel; the horizontal blur follows its speed, so content is sharp at rest.
  const travel = useCallback((element: HTMLElement, left: number, duration: number) => {
    glide.current?.kill()
    element.dataset.travelling = ''
    const state = { left: element.scrollLeft }
    let previous = state.left
    let stamp = performance.now()
    glide.current = gsap.to(state, {
      left, duration, ease: 'power3.inOut',
      onUpdate: () => {
        const now = performance.now()
        const speed = Math.abs(state.left - previous) / Math.max(8, now - stamp)
        previous = state.left
        stamp = now
        element.scrollLeft = state.left
        blur.current?.setAttribute('stdDeviation', `${Math.min(28, speed * 7).toFixed(1)} 0`)
      },
      onComplete: () => settle(element, left),
    })
  }, [settle])

  const show = useCallback((index: number, hash = true, animate = true) => {
    const next = Math.max(0, Math.min(destinations.length - 1, index))
    const hops = next - currentRef.current
    const duration = travelTime(hops)
    if (hops !== 0) window.dispatchEvent(new CustomEvent<JourneyTravel>('journey-travel', { detail: { hops, duration } }))
    currentRef.current = next
    setCurrent(next)
    const element = track.current
    const panel = element?.children[next] as HTMLElement | undefined
    if (element && panel) {
      if (animate && hops !== 0 && !prefersReducedMotion()) travel(element, panel.offsetLeft, duration)
      else settle(element, panel.offsetLeft)
    }
    if (hash && location.hash !== `#${destinations[next].id}`) history.pushState(null, '', `#${destinations[next].id}`)
  }, [settle, travel])

  useEffect(() => () => { glide.current?.kill() }, [])

  useEffect(() => {
    const followHash = (event?: Event) => {
      const id = decodeURIComponent(location.hash.slice(1))
      const target = document.getElementById(id)
      const panel = target?.closest('[data-destination]') as HTMLElement | null
      const index = id === 'skills' ? destinations.findIndex((destination) => destination.id === 'about') : destinations.findIndex((destination) => destination.id === (panel?.dataset.destination ?? id))
      if (index >= 0) {
        const deep = !!target && target !== panel && id !== destinations[index].id
        show(index, false, !!event && !deep)
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

  // Fragment links focus the target panel too; its ring only helps people who reached it with the keyboard.
  useEffect(() => {
    const keys = (event: KeyboardEvent) => { if (event.key === 'Tab') track.current?.setAttribute('data-keys', '') }
    const pointer = () => track.current?.removeAttribute('data-keys')
    window.addEventListener('keydown', keys)
    window.addEventListener('pointerdown', pointer)
    return () => { window.removeEventListener('keydown', keys); window.removeEventListener('pointerdown', pointer) }
  }, [])

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
      if (element.dataset.travelling !== undefined) return
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
      <button className={styles.step} onClick={() => show(current - 1)} disabled={current === 0} aria-label="Previous destination"><Chevron /></button>
      <div className={styles.route} style={{ '--stops': destinations.length, '--progress': current / (destinations.length - 1) } as CSSProperties}>
        <span aria-hidden="true" className={styles.line} />
        <span aria-hidden="true" className={styles.travelled} />
        <span aria-hidden="true" className={styles.pulse} />
        {destinations.map((destination, index) => <a
          key={destination.id}
          href={`#${destination.id}`}
          className={index < current ? styles.passed : undefined}
          onClick={(event) => { event.preventDefault(); show(index) }}
          aria-current={current === index ? 'location' : undefined}
        ><span aria-hidden="true" className={styles.station} /><span>{destination.label}</span></a>)}
      </div>
      <button className={`${styles.step} ${styles.next}`} onClick={() => show(current + 1)} disabled={current === destinations.length - 1} aria-label="Next destination"><Chevron /></button>
    </nav>
    <svg className={styles.filters} aria-hidden="true" focusable="false">
      <filter id="journey-motion" x="-5%" y="0" width="110%" height="100%" colorInterpolationFilters="sRGB">
        <feGaussianBlur ref={blur} stdDeviation="0 0" />
      </filter>
    </svg>
  </>
}

function Chevron() {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
