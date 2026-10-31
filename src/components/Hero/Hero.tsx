import styles from './Hero.module.css'
import WorkflowConstellation from '../WorkflowConstellation/WorkflowConstellation'
import type { HeroData } from '../../lib/parsePortfolio'

export default function Hero({ data }: { data: HeroData }) {
  return <section className={styles.hero} aria-label="Introduction">
    <div className={styles.content}>
      <p className={styles.label}>{data.name} / {data.title}</p>
      <h1>{data.headline || data.name}</h1>
      <p className={styles.title}><span>{data.title}</span> · <span>{data.location}</span></p>
      <p className={styles.tagline}>{data.tagline}</p>
      <a className={styles.profile} href={data.github} target="_blank" rel="noopener noreferrer">GitHub profile ↗</a>
    </div>
    <WorkflowConstellation className={styles.lens} />
  </section>
}
