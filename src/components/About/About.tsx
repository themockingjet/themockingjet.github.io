import { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'
import type { AboutData } from '../../lib/parsePortfolio'

export default function About({ data }: { data: AboutData }) {
  const [personaIdx, setPersonaIdx] = useState(0)
  const [changed, setChanged] = useState<Set<string>>(() => new Set())
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current) }, [])
  const choosePersona = (next: number) => {
    const updated = new Set<string>()
    data.slots.forEach(({ label, segments }) => segments.forEach((segment, i) => {
      if (segment.type === 'slot' && segment.variants[personaIdx % segment.variants.length] !== segment.variants[next % segment.variants.length]) updated.add(`${label}-${i}`)
    }))
    setChanged(updated)
    setPersonaIdx(next)
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setChanged(new Set()), 1200)
  }
  return <section className={styles.about} aria-label="About"><div className={styles.inner}>
    <h2 className={styles.heading}>Curiosity is the constant.</h2>
    <div className={styles.copy}>
    {data.personas.length > 0 && <label className={styles.persona}>Read as <select value={personaIdx} onChange={(event) => choosePersona(Number(event.target.value))}>{data.personas.map((persona, index) => <option key={persona} value={index}>{persona}</option>)}</select></label>}
    <div className={styles.prose}>{data.slots.map(({ label, segments }, index) => <div key={label} className={styles.slot}>
      <h3 className={styles.intent}>{label.charAt(0).toUpperCase() + label.slice(1)}</h3>
      <p className={`${styles.paragraph} ${index === 0 ? styles.lead : ''}`}>{segments.map((segment, i) => segment.type === 'text' ? <span key={i}>{segment.value}</span> : <span className={`${styles.word} ${changed.has(`${label}-${i}`) ? styles.changed : ''}`} key={`${i}-${segment.variants[personaIdx % segment.variants.length]}`}>{segment.variants[personaIdx % segment.variants.length]}</span>)}</p>
    </div>)}</div></div>
  </div></section>
}
