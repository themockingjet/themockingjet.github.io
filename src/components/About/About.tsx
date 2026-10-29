import { useState } from 'react'
import styles from './About.module.css'
import type { AboutData } from '../../lib/parsePortfolio'

export default function About({ data }: { data: AboutData }) {
  const [personaIdx, setPersonaIdx] = useState(0)
  return <section className={styles.about} aria-label="About"><div className={styles.inner}>
    <div className={styles.intro}><h2 className={styles.heading}>About</h2><p>Curiosity is the constant.</p></div>
    <div className={styles.copy}>
    {data.personas.length > 0 && <p className={styles.personaIndicator}>// perspective: <select aria-label="Choose perspective" value={personaIdx} onChange={(event) => setPersonaIdx(Number(event.target.value))}>{data.personas.map((persona, index) => <option key={persona} value={index}>{persona}</option>)}</select></p>}
    <div className={styles.prose}>{data.slots.map(({ label, segments }, index) => <div key={label} className={styles.slot}>
      <span className={styles.intent}>// {label}</span>
      <p className={`${styles.paragraph} ${index === 0 ? styles.lead : ''}`}>{segments.map((segment, i) => segment.type === 'text' ? <span key={i}>{segment.value}</span> : <span className={styles.word} key={i}>{segment.variants[personaIdx % segment.variants.length]}</span>)}</p>
    </div>)}</div></div>
  </div></section>
}
