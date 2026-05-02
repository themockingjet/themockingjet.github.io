import { useEffect, useState, useCallback, useRef } from 'react'
import { Icon } from '@iconify/react'
import styles from './Nav.module.css'
import { THEMES, type ThemeId } from '../../App'

const SECTIONS = [
  { id: 'hero',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills',   label: 'Skills' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

interface NavProps {
  name: string
  dark: boolean
  onToggleDark: () => void
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
}

export default function Nav({ name, dark, onToggleDark, theme, onThemeChange }: NavProps) {
  const [active, setActive] = useState<SectionId>('hero')
  const [themeOpen, setThemeOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const activeIndex = SECTIONS.findIndex(s => s.id === active)

  useEffect(() => {
    const OFFSET = Math.floor(window.innerHeight * 0.35)

    const getActive = (): SectionId => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80
      if (nearBottom) return SECTIONS[SECTIONS.length - 1].id as SectionId

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= OFFSET) {
          return SECTIONS[i].id as SectionId
        }
      }
      return SECTIONS[0].id as SectionId
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setActive(getActive())
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    setActive(getActive())

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Close theme dropdown on outside click or Escape
  useEffect(() => {
    if (!themeOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setThemeOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setThemeOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [themeOpen])

  const currentTheme = THEMES.find(t => t.id === theme)!

  return (
    <>
      {/* Top bar: brand + theme swatches + dark toggle */}
      <header className={styles.bar} data-el="nav-bar">
        <div className={styles.inner}>
          <button className={styles.brand} data-el="nav-brand" onClick={() => scrollTo('hero')}>
            {name}
          </button>

          <div className={styles.themePicker} ref={pickerRef}>
            <button
              className={styles.themeToggle}
              onClick={() => setThemeOpen(o => !o)}
              aria-expanded={themeOpen}
              aria-haspopup="listbox"
              aria-label={`Theme: ${currentTheme.label}`}
            >
              <span className={styles.themeToggleDot} />
              {currentTheme.label}
              <Icon
                icon="lucide:chevron-down"
                width={10}
                height={10}
                className={`${styles.themeToggleChevron} ${themeOpen ? styles.open : ''}`}
                aria-hidden
              />
            </button>

            {themeOpen && (
              <div className={styles.themeDropdown} role="listbox" aria-label="Choose theme">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.themeOption} ${theme === t.id ? styles.themeOptionActive : ''}`}
                    role="option"
                    aria-selected={theme === t.id}
                    onClick={() => { onThemeChange(t.id); setThemeOpen(false) }}
                  >
                    <span
                      className={styles.themeOptionDot}
                      style={{ background: t.accent }}
                    />
                    {t.label}
                    {theme === t.id && (
                      <Icon icon="lucide:check" width={12} height={12} className={styles.themeOptionCheck} aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={styles.darkToggle}
            onClick={onToggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className={`${styles.toggleTrack} ${!dark ? styles.light : ''}`}>
              <span className={styles.toggleThumb}>
                {dark
                ? <Icon icon="lucide:moon" width={11} height={11} aria-hidden />
                : <Icon icon="lucide:sun" width={11} height={11} aria-hidden />}
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* Left floating section navigator */}
      <div className={styles.widget} data-el="nav-widget">
        <div className={styles.track}>
          <div
            className={styles.trackFill}
            style={{ height: `${(activeIndex / (SECTIONS.length - 1)) * 100}%` }}
          />
        </div>
        <nav className={styles.nav} data-el="nav-nav" aria-label="Section navigation">
          <ul className={styles.list} data-el="nav-list" role="list">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`${styles.link} ${active === id ? styles.active : ''}`}
                  onClick={() => scrollTo(id)}
                  aria-current={active === id ? 'page' : undefined}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* .md link: fixed bottom-left, in its own landmark for a11y */}
      <aside aria-label="Source links">
        <a
          className={styles.mdLink}
          data-el="nav-md-link"
          href="/raw/portfolio.md"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source as Markdown"
        >
          view as markdown
        </a>
      </aside>

      {/* Bottom nav bar (mobile) */}
      <nav className={styles.bottomNav} aria-label="Section navigation (mobile)">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.bottomLink} ${active === id ? styles.bottomActive : ''}`}
            onClick={() => scrollTo(id)}
            aria-current={active === id ? 'page' : undefined}
          >
            <Icon
              icon={
                id === 'hero' ? 'lucide:home' :
                id === 'about' ? 'lucide:user' :
                id === 'projects' ? 'lucide:folder' :
                'lucide:cpu'
              }
              width={18}
              height={18}
              aria-hidden
            />
            <span className={styles.bottomLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
