import styles from './Skills.module.css'
import type { SkillsData } from '../../lib/parsePortfolio'

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null
  return <div className={styles.group}><h3 className={styles.groupLabel}>{label}</h3><ul className={styles.list} role="list">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}
export default function Skills({ skills }: { skills: SkillsData }) {
  return <section className={styles.skills} aria-label="Skills"><div className={styles.inner}><h2 className={styles.heading}>Skills</h2><div className={styles.groups}><SkillGroup label="Stack" items={skills.stack}/><SkillGroup label="Tools and platforms" items={skills.others}/></div></div></section>
}
