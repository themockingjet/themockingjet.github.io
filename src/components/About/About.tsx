import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { useEffect, useState, useRef } from 'react'
import styles from './About.module.css'
import type { AboutData } from '../../lib/parsePortfolio'
import { EASE, STAGGER } from '../../lib/motion'

interface AboutProps {
  data: AboutData
}

const CYCLE_MS  = 7000
const FADE_MS   = 0.35

const ENTER = STAGGER

const SLOT_ENTER = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

function WordSlot({ variants, personaIdx }: { variants: string[]; personaIdx: number }) {
  const [hasSwapped, setHasSwapped] = useState(false)
  const prevIdx = useRef(personaIdx)

  useEffect(() => {
    if (prevIdx.current !== personaIdx) {
      prevIdx.current = personaIdx
      setHasSwapped(true)
    }
  }, [personaIdx])

  return (
    <motion.span
      className={styles.word}
      animate={{
        borderBottomColor: hasSwapped
          ? 'color-mix(in srgb, var(--color-accent) 25%, transparent)'
          : 'rgba(0, 0, 0, 0)',
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={personaIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS, ease: 'easeInOut' }}
        >
          {variants[personaIdx % variants.length]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export default function About({ data }: AboutProps) {
  const { personas, slots } = data
  const [personaIdx, setPersonaIdx] = useState(0)
  const [ready, setReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const decorY = useTransform(scrollYProgress, [0, 1], [70, -110])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready || personas.length < 2) return
    const interval = setInterval(
      () => setPersonaIdx((p) => (p + 1) % personas.length),
      CYCLE_MS,
    )
    return () => clearInterval(interval)
  }, [ready, personas.length])

  return (
    <section ref={sectionRef} className={styles.about} aria-label="About">
      <motion.span className={styles.decor} aria-hidden="true" style={{ y: decorY }}>
        About
      </motion.span>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          About
        </motion.h2>
        {personas.length > 0 && (
          <motion.p
            className={styles.personaIndicator}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            aria-live="polite"
            aria-atomic="true"
          >
            {'// tailoring for:\u00a0'}
            <AnimatePresence mode="wait">
              <motion.span
                key={personaIdx}
                className={styles.personaName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {personas[personaIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.p>
        )}
        <motion.div
          className={styles.prose}
          variants={ENTER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {slots.map(({ label, segments }, i) => (
            <motion.div key={label} className={styles.slot} variants={SLOT_ENTER}>
              <span className={styles.intent}>// {label}</span>
              <p className={`${styles.paragraph} ${i === 0 ? styles.lead : ''}`}>
                {segments.map((seg, j) =>
                  seg.type === 'text' ? (
                    <span key={j}>{seg.value}</span>
                  ) : (
                    <WordSlot key={j} variants={seg.variants} personaIdx={personaIdx} />
                  )
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
