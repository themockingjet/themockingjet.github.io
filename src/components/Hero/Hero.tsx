import styles from './Hero.module.css'
import type { HeroData } from '../../lib/parsePortfolio'

export default function Hero({ data }: { data: HeroData }) {
  return <section className={styles.hero} aria-label="Introduction">
    <div className={styles.content}>
      <p className={styles.label}>{data.name} / {data.title}</p>
      <h1>{data.headline || data.name}</h1>
      <p className={styles.title}><span>{data.title}</span> · <span>{data.location}</span></p>
      <p className={styles.tagline}>{data.tagline}</p>
      <div className={styles.actions}><a href="#projects">Explore my work ↗</a><a href="#route">Plot your route →</a></div>
      <a className={styles.profile} href={data.github} target="_blank" rel="noopener noreferrer">GitHub profile ↗</a>
    </div>
    <svg className={styles.lens} viewBox="0 0 800 720" aria-hidden="true">
      <defs>
        <radialGradient id="lens-halo"><stop stopColor="#1b384f" stopOpacity="0"/><stop offset=".48" stopColor="#426b81" stopOpacity=".09"/><stop offset=".65" stopColor="#83b6c6" stopOpacity=".16"/><stop offset="1" stopColor="#1b384f" stopOpacity="0"/></radialGradient>
        <radialGradient id="event-horizon"><stop offset=".75" stopColor="#03070d"/><stop offset=".93" stopColor="#07101b"/><stop offset="1" stopColor="#9ac8cf"/></radialGradient>
        <linearGradient id="accretion"><stop stopColor="#8faebd" stopOpacity="0"/><stop offset=".2" stopColor="#9ec9d3"/><stop offset=".48" stopColor="#ffedc8"/><stop offset=".7" stopColor="#d5a368"/><stop offset="1" stopColor="#8faebd" stopOpacity="0"/></linearGradient>
        <filter id="disk-glow" x="-60%" y="-80%" width="220%" height="260%"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>
      <circle cx="412" cy="348" r="310" fill="url(#lens-halo)"/>
      <g transform="rotate(-23 412 348)" fill="none" stroke="url(#accretion)"><ellipse cx="412" cy="348" rx="330" ry="74" strokeWidth="18" opacity=".34" filter="url(#disk-glow)"/><ellipse cx="412" cy="348" rx="330" ry="74" strokeWidth="2"/><ellipse cx="412" cy="348" rx="292" ry="64" strokeWidth="4" opacity=".5"/><ellipse cx="412" cy="348" rx="263" ry="53" opacity=".7"/></g>
      <circle cx="412" cy="348" r="140" fill="url(#event-horizon)"/><path d="M274 360a140 140 0 1 1 276-24" fill="none" stroke="#e0eee6" strokeWidth="2" opacity=".8"/>
      <g transform="rotate(-23 412 348)"><path d="M82 348a330 74 0 0 0 660 0" fill="none" stroke="url(#accretion)" strokeWidth="4"/></g>
      <g stroke="#9eb7c1" strokeWidth=".6" opacity=".55"><path d="M412 73v34m0 482v34M133 348h28m505 0h30"/><circle cx="412" cy="348" r="246" fill="none" strokeDasharray="1 12"/></g>
    </svg>
  </section>
}
