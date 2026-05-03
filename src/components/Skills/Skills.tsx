import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Icon } from '@iconify/react'
import styles from './Skills.module.css'
import type { SkillsData } from '../../lib/parsePortfolio'
import { resolveIcon } from '../../lib/icons'
import { EASE, STAGGER, FADE_UP_SM } from '../../lib/motion'

const CHIP = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
}

interface SkillsProps {
  skills: SkillsData
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <motion.div className={styles.group} variants={FADE_UP_SM}>
      <h3 className={styles.groupLabel}>{label}</h3>
      <motion.ul className={styles.chipList} role="list" variants={STAGGER}>
        {items.map((item) => {
          const icon = resolveIcon(item)
          return (
            <motion.li key={item} className={styles.chip} variants={CHIP}>
              {icon && (
                <span className={styles.chipIcon}>
                  <Icon icon={icon} width={22} height={22} aria-hidden />
                </span>
              )}
              {item}
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.div>
  )
}

export default function Skills({ skills }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const decorY = useTransform(scrollYProgress, [0, 1], [60, -100])

  return (
    <section ref={sectionRef} className={styles.skills} aria-label="Skills">
      <motion.span className={styles.decor} aria-hidden="true" style={{ y: decorY }}>
        Skills
      </motion.span>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          Skills
        </motion.h2>
        <motion.div
          className={styles.groups}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SkillGroup label="Stack" items={skills.stack} />
          <SkillGroup label="Tools & Platforms" items={skills.others} />
        </motion.div>
      </div>
    </section>
  )
}
