import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './SpaceBackground.module.css'

export default function SpaceBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scenery = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = canvas.current
    const layer = scenery.current
    const context = element?.getContext('2d')
    if (!element || !layer || !context) return

    let seed = 7381
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
    const stars = Array.from({ length: 170 }, () => {
      const sizeRoll = random()
      return {
        x: random(), y: random(),
        size: sizeRoll > .985 ? 1.7 + random() * .8 : sizeRoll > .82 ? .9 + random() * .7 : .35 + random() * .65,
        alpha: .22 + random() * .55,
        speed: .25 + random() * 1.1,
        phase: random() * Math.PI * 2,
      }
    })
    let frame = 0, last = 0, offset = 0, width = 0, height = 0, travel = 0, elapsed = 0
    let tween: gsap.core.Tween | undefined

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      for (const star of stars) {
        const x = ((star.x * width + offset * star.speed) % width + width) % width
        const y = star.y * height
        const shimmer = .82 + .18 * Math.sin(time * .0012 + star.phase)
        const streak = travel * (18 + star.speed * 94)
        context.globalAlpha = star.alpha * shimmer
        if (streak > 1) {
          const trail = context.createLinearGradient(x - streak, y, x + star.size, y)
          trail.addColorStop(0, 'rgba(181,215,226,0)')
          trail.addColorStop(1, 'rgba(181,215,226,1)')
          context.fillStyle = trail
          context.fillRect(x - streak, y - star.size * .3, streak + star.size, Math.max(.55, star.size * .65))
        }
        context.fillStyle = '#d8edf3'
        context.beginPath()
        context.arc(x, y, star.size * .55, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(elapsed)
    }
    const animated = () => !document.hidden
    const tick = (time: number) => {
      if (!animated()) { frame = 0; return }
      if (time - last >= 33) { elapsed = time; offset += .24; draw(elapsed); last = time }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      if (animated()) frame = requestAnimationFrame(tick)
      else { tween?.kill(); travel = 0; gsap.set(layer, { filter: 'blur(0px)' }); draw(elapsed) }
    }
    const onTravel = () => {
      if (!animated()) return
      tween?.kill()
      const state = { amount: 1 }
      travel = 1
      gsap.set(layer, { filter: 'blur(3.5px)' })
      tween = gsap.to(state, { amount: 0, duration: 1.15, ease: 'power2.out', onUpdate: () => { travel = state.amount; gsap.set(layer, { filter: `blur(${state.amount * 3.5}px)` }); draw(elapsed) } })
    }

    resize()
    sync()
    window.addEventListener('resize', resize)
    window.addEventListener('journey-travel', onTravel)
    document.addEventListener('visibilitychange', sync)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      tween?.kill()
      window.removeEventListener('resize', resize)
      window.removeEventListener('journey-travel', onTravel)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <div ref={scenery} className={styles.scenery} aria-hidden="true"><canvas ref={canvas} className={styles.canvas} /></div>
}
