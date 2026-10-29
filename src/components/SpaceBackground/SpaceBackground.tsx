import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './SpaceBackground.module.css'

export type MotionPreference = 'full' | 'subtle' | 'off'

export default function SpaceBackground({ motion }: { motion: MotionPreference }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scenery = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = canvas.current
    const layer = scenery.current
    const context = element?.getContext('2d')
    if (!element || !layer || !context) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stars = Array.from({ length: 150 }, (_, i) => ({ x: ((i * 137.508) % 100) / 100, y: ((i * 73.137) % 100) / 100, size: .4 + (i % 5) * .2 }))
    let frame = 0, last = 0, offset = 0, width = 0, height = 0, travel = 0
    let tween: gsap.core.Tween | undefined
    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#b5d7e2'
      for (const star of stars) {
        const x = ((star.x * width + offset * star.size) % width + width) % width
        const y = star.y * height
        context.globalAlpha = .25 + star.size * .3
        context.fillRect(x, y, star.size + travel * star.size * 14, star.size)
      }
      context.globalAlpha = 1
    }
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw()
    }
    const animated = () => motion === 'full' && !media.matches && !document.hidden
    const tick = (time: number) => {
      if (!animated()) { frame = 0; return }
      if (time - last >= 33) { offset += .12; draw(); last = time }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      if (animated()) frame = requestAnimationFrame(tick)
      else { tween?.kill(); travel = 0; gsap.set(layer, { filter: 'blur(0px)' }); draw() }
    }
    const onTravel = () => {
      if (!animated()) return
      tween?.kill()
      const state = { amount: 1 }
      travel = 1
      gsap.set(layer, { filter: 'blur(4px)' })
      tween = gsap.to(state, { amount: 0, duration: .8, ease: 'power2.out', onUpdate: () => { travel = state.amount; gsap.set(layer, { filter: `blur(${state.amount * 4}px)` }) } })
    }
    resize(); sync()
    window.addEventListener('resize', resize)
    window.addEventListener('journey-travel', onTravel)
    document.addEventListener('visibilitychange', sync)
    media.addEventListener('change', sync)
    return () => { if (frame) cancelAnimationFrame(frame); tween?.kill(); window.removeEventListener('resize', resize); window.removeEventListener('journey-travel', onTravel); document.removeEventListener('visibilitychange', sync); media.removeEventListener('change', sync) }
  }, [motion])
  return <div ref={scenery} className={styles.scenery} aria-hidden="true"><canvas ref={canvas} className={styles.canvas} /></div>
}
