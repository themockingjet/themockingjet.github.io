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
        <radialGradient id="lens-halo"><stop stopColor="#172b3a" stopOpacity="0"/><stop offset=".46" stopColor="#426b81" stopOpacity=".08"/><stop offset=".64" stopColor="#83b6c6" stopOpacity=".19"/><stop offset="1" stopColor="#1b384f" stopOpacity="0"/></radialGradient>
        <radialGradient id="event-horizon"><stop offset=".68" stopColor="#010307"/><stop offset=".87" stopColor="#02060b"/><stop offset=".94" stopColor="#09111a"/><stop offset=".98" stopColor="#9bc6ce"/><stop offset="1" stopColor="#f2d9b1"/></radialGradient>
        <linearGradient id="accretion" x1="0" y1="0" x2="1" y2=".18"><stop stopColor="#718da0" stopOpacity="0"/><stop offset=".2" stopColor="#9ec9d3"/><stop offset=".43" stopColor="#d9e5dc"/><stop offset=".52" stopColor="#fff3d3"/><stop offset=".7" stopColor="#e4ad69"/><stop offset=".88" stopColor="#a96b43"/><stop offset="1" stopColor="#8faebd" stopOpacity="0"/></linearGradient>
        <linearGradient id="lensed-rim" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#8daaba" stopOpacity="0"/><stop offset=".25" stopColor="#c5d9d8"/><stop offset=".5" stopColor="#fff0ce"/><stop offset=".72" stopColor="#d6a16a"/><stop offset="1" stopColor="#8daaba" stopOpacity="0"/></linearGradient>
        <filter id="disk-glow" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="13"/></filter>
      </defs>
      <circle cx="412" cy="348" r="310" fill="url(#lens-halo)"/>
      <g transform="rotate(-23 412 348)" fill="none" stroke="url(#accretion)"><ellipse cx="412" cy="348" rx="330" ry="74" strokeWidth="22" opacity=".42" filter="url(#disk-glow)"/><ellipse cx="412" cy="348" rx="330" ry="74" strokeWidth="3" opacity=".72"/><ellipse cx="412" cy="348" rx="294" ry="61" strokeWidth="6" opacity=".65"/><ellipse cx="412" cy="348" rx="266" ry="52" strokeWidth="2" opacity=".86"/></g>
      <circle cx="412" cy="348" r="145" fill="#05090f"/>
      <circle cx="412" cy="348" r="140" fill="url(#event-horizon)"/>
      <path d="M286 305a140 140 0 0 1 252-12" fill="none" stroke="url(#lensed-rim)" strokeWidth="3" opacity=".9"/>
      <g transform="rotate(-23 412 348)" fill="none"><path d="M82 348a330 74 0 0 0 660 0" stroke="url(#accretion)" strokeWidth="8" opacity=".9"/><path d="M109 348a303 62 0 0 0 606 0" stroke="url(#lensed-rim)" strokeWidth="2" opacity=".9"/><path d="M147 348a265 52 0 0 0 530 0" stroke="url(#accretion)" strokeWidth="2" opacity=".6"/></g>
      <g stroke="#9eb7c1" strokeWidth=".6" opacity=".55"><path d="M412 73v34m0 482v34M133 348h28m505 0h30"/><circle cx="412" cy="348" r="246" fill="none" strokeDasharray="1 12"/></g>
    </svg>
  </section>
}
