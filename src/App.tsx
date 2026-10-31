import { useState, useEffect } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Footer from './components/Footer/Footer'
import AutomationLab from './components/AutomationLab/AutomationLab'
import Journey from './components/Journey/Journey'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import SpaceBackground from './components/SpaceBackground/SpaceBackground'
import { parsePortfolio } from './lib/parsePortfolio'
import rawPortfolio from './content/portfolio.md?raw'
import { THEMES, type ThemeId } from './lib/themes'

const portfolio = parsePortfolio(rawPortfolio)

export default function App() {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('portfolio-mode') !== 'light' } catch { return true } })
  const [theme, setTheme] = useState<ThemeId>(() => { try { const stored = localStorage.getItem('portfolio-theme'); return THEMES.find((item) => item.id === stored)?.id ?? 'amber' } catch { return 'amber' } })
  const toggleDark = () => setDark((d) => !d)

  useEffect(() => {
    if (dark) document.documentElement.removeAttribute('data-mode')
    else document.documentElement.setAttribute('data-mode', 'light')
    try { localStorage.setItem('portfolio-mode', dark ? 'dark' : 'light') } catch { /* preferences are optional */ }
  }, [dark])

  useEffect(() => {
    if (theme === 'amber') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('portfolio-theme', theme) } catch { /* preferences are optional */ }
  }, [theme])

  return (
    <>
      <SpaceBackground />
      <Nav
        name={portfolio.hero.name}
        dark={dark}
        onToggleDark={toggleDark}
        theme={theme}
        onThemeChange={setTheme}
      />

      <Journey>
        <Hero data={portfolio.hero} />
        <Projects projects={portfolio.projects} />
        <AutomationLab />
        <><About data={portfolio.about} /><div id="skills"><Skills skills={portfolio.skills} /></div></>
        <section className="contact" aria-labelledby="contact-heading"><div className="contact-inner"><h2 id="contact-heading">{portfolio.hero.contactHeadline}</h2><div className="contact-action"><p>Find Jet on GitHub.</p><a href={portfolio.hero.github}>Visit GitHub profile</a></div><Footer /></div></section>
      </Journey>
    </>
  )
}
