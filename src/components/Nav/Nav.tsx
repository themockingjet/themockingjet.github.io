import { useEffect, useRef, useState } from 'react'
import styles from './Nav.module.css'
import { THEMES, type ThemeId } from '../../lib/themes'

interface NavProps { name: string; dark: boolean; onToggleDark: () => void; theme: ThemeId; onThemeChange: (id: ThemeId) => void }

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
    <a className={styles.brand} href="#hero" aria-label={`${name} home`}><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="5"/><ellipse cx="16" cy="16" rx="15" ry="6" transform="rotate(-35 16 16)"/></svg><span>jet.</span></a>
    <span className={styles.tagline}>A journey beyond the manual.</span>
    <div className={styles.preferences}>
      <a className={styles.raw} href="/raw/portfolio.md" target="_blank" rel="noopener noreferrer">Markdown</a>
      <div className={styles.themePicker} ref={picker}>
        <button className={styles.themeToggle} onClick={() => setThemeOpen(!themeOpen)} aria-expanded={themeOpen} aria-haspopup="listbox" aria-label={`Theme: ${current.label}`}><span className={styles.dot} />{current.label} ▾</button>
        {themeOpen && <div className={styles.themeDropdown} role="listbox" aria-label="Choose theme">{THEMES.map((item) => <button key={item.id} className={styles.themeOption} role="option" aria-selected={theme === item.id} onClick={() => { onThemeChange(item.id); setThemeOpen(false) }}><span className={styles.optionDot} style={{ background: item.accent }}/>{item.label}</button>)}</div>}
      </div>
      <button className={styles.darkToggle} onClick={onToggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? '☀' : '☾'}</button>
    </div>
  </div></header>
}
