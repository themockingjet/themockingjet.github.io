import { useEffect, useId, useRef, useState } from 'react'
import styles from './Nav.module.css'
import Logo from './Logo'
import { THEMES, type ThemeId } from '../../lib/themes'

interface NavProps { name: string; dark: boolean; onToggleDark: () => void; theme: ThemeId; onThemeChange: (id: ThemeId) => void }

function ModeIcon({ dark }: { dark: boolean }) {
  const mask = useId()
  // Dark mode shows a sun (switch to light); light mode slides a shadow across it to form a moon.
  return <svg className={styles.modeIcon} data-dark={dark} viewBox="0 0 24 24" aria-hidden="true">
    <mask id={mask}><rect width="24" height="24" fill="#fff" /><circle className={styles.shadow} cx={dark ? 30 : 16.5} cy={dark ? -4 : 8} r="6.5" fill="#000" /></mask>
    <circle className={styles.disc} cx="12" cy="12" r={dark ? 4.6 : 7.5} mask={`url(#${mask})`} />
    <g className={styles.rays}>{Array.from({ length: 8 }, (_, i) => <line key={i} x1="12" y1="2.2" x2="12" y2="4.4" transform={`rotate(${i * 45} 12 12)`} />)}</g>
  </svg>
}

export default function Nav({ name, dark, onToggleDark, theme, onThemeChange }: NavProps) {
  const [themeOpen, setThemeOpen] = useState(false)
  const picker = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!themeOpen) return
    const close = (event: MouseEvent) => { if (!picker.current?.contains(event.target as Node)) setThemeOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setThemeOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape) }
  }, [themeOpen])
  const current = THEMES.find((item) => item.id === theme)!
  return <header className={styles.bar} data-el="nav-bar"><div className={styles.inner}>
    <a className={styles.brand} href="#hero" aria-label={`${name} home`}><Logo className={styles.logo} /></a>
    <div className={styles.preferences}>
      <a className={styles.control} href="/raw/portfolio.md" target="_blank" rel="noopener noreferrer" aria-label="Read this portfolio as Markdown" title="Read as Markdown">
        <svg className={styles.markdown} viewBox="0 0 26 16" aria-hidden="true"><rect x=".75" y=".75" width="24.5" height="14.5" rx="2.5" /><path d="M4.5 11.5v-7l3 3.5 3-3.5v7M17.5 4.5v6.5m-2.75-2.6 2.75 3 2.75-3" /></svg>
      </a>
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.themePicker} ref={picker}>
        <button className={styles.control} onClick={() => setThemeOpen(!themeOpen)} aria-expanded={themeOpen} aria-haspopup="listbox" aria-label={`Theme: ${current.label}`} title="Accent colour"><span className={styles.swatch} /></button>
        {themeOpen && <div className={styles.themeDropdown} role="listbox" aria-label="Choose theme">{THEMES.map((item) => <button key={item.id} className={styles.themeOption} role="option" aria-selected={theme === item.id} onClick={() => { onThemeChange(item.id); setThemeOpen(false) }}><span className={styles.optionDot} style={{ background: item.accent }}/>{item.label}</button>)}</div>}
      </div>
      <button className={styles.control} onClick={onToggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}><ModeIcon dark={dark} /></button>
    </div>
  </div></header>
}
