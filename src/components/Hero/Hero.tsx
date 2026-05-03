import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import type { HeroData } from '../../lib/parsePortfolio'
import { EASE, STAGGER_DELAY } from '../../lib/motion'

interface HeroProps {
  data: HeroData
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}

// Divider draws from left to right
const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  show:   { scaleX: 1, originX: 0, transition: { duration: 0.55, ease: EASE } },
}

const TYPE_MS   = 55
const START_MS  = 300

function TypewriterName({ name }: { name: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let i = 0
    const t = setTimeout(() => {
      const tick = () => {
        if (cancelled) return
        i++
        setDisplayed(name.slice(0, i))
        if (i < name.length) setTimeout(tick, TYPE_MS)
        else setDone(true)
      }
      tick()
    }, START_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [name])

  // Full name is always in the DOM (untyped portion opacity:0),
  // so h1 width never changes during the typewriter animation.
  const untyped = done ? '' : name.slice(displayed.length)
  return (
    <h1 className={styles.name} aria-label={name}>
      <span aria-hidden="true">{displayed}</span>
      <span className={`${styles.caret} ${done ? styles.caretBlink : ''}`} aria-hidden="true">|</span>
      {untyped && <span aria-hidden="true" className={styles.nameUntyped}>{untyped}</span>}
    </h1>
  )
}

export default function Hero({ data }: HeroProps) {
  const initial = data.name.charAt(0).toUpperCase()
  const heroRef = useRef<HTMLElement>(null)

  // Parallax: decor letter drifts up as the hero scrolls out of view
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -220])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Introduction">
      <motion.span
        className={styles.decor}
        aria-hidden="true"
        style={{ y: decorY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2.2, delay: 0.1, ease: EASE }}
      >
        {initial}
      </motion.span>

      <motion.div
        className={styles.content}
        style={{ y: contentY }}
        variants={STAGGER_DELAY}
        initial="hidden"
        animate="show"
      >
        <motion.p className={styles.label} variants={item}>Portfolio</motion.p>

        <TypewriterName name={data.name} />

        <motion.hr className={styles.divider} variants={lineReveal} />
        <motion.p className={styles.title} variants={item}>{data.title}</motion.p>
        {data.tagline && (
          <motion.p className={styles.tagline} variants={item}>{data.tagline}</motion.p>
        )}

        <motion.div className={styles.badges} variants={item}>
          <span className={styles.badge}>{data.location}</span>
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badge}
          >
            github<span className={styles.badgeArrow}>↗</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
