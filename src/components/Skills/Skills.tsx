import { Icon } from '@iconify/react'
import styles from './Skills.module.css'
import type { SkillsData } from '../../lib/parsePortfolio'
import { resolveIcon } from '../../lib/icons'

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null
  return <div className={styles.group}><h3 className={styles.groupLabel}>{label}</h3><ul className={styles.chipList} role="list">{items.map((item) => {
    const icon = resolveIcon(item)
    return <li key={item} className={styles.chip}>{icon && <span className={styles.chipIcon}><Icon icon={icon} width={22} height={22} aria-hidden /></span>}{item}</li>
  })}</ul></div>
}
export default function Skills({ skills }: { skills: SkillsData }) {
  return <section className={styles.skills} aria-label="Skills"><div className={styles.inner}><h2 className={styles.heading}>Skills</h2><div className={styles.groups}><SkillGroup label="Stack" items={skills.stack}/><SkillGroup label="Tools & Platforms" items={skills.others}/></div></div></section>
}
