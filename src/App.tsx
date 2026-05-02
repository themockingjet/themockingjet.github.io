import { motion } from 'motion/react'
import { useState, useEffect, lazy, Suspense } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Footer from './components/Footer/Footer'
import { parsePortfolio } from './lib/parsePortfolio'
import rawPortfolio from './content/portfolio.md?raw'

const About = lazy(() => import('./components/About/About'))
const Projects = lazy(() => import('./components/Projects/Projects'))
const Skills = lazy(() => import('./components/Skills/Skills'))

const portfolio = parsePortfolio(rawPortfolio)

export const THEMES = [
  { id: 'warm',   label: 'Warm',   accent: '#5e8a70' },
  { id: 'ocean',  label: 'Ocean',  accent: '#4a9eff' },
  { id: 'ember',  label: 'Ember',  accent: '#e07840' },
  { id: 'violet', label: 'Violet', accent: '#8b67e8' },
  { id: 'slate',  label: 'Slate',  accent: '#5b8fa8' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

const REVEAL = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

export default function App() {
  const [dark, setDark] = useState(true)
  const [theme, setTheme] = useState<ThemeId>('warm')
  const toggleDark = () => setDark((d) => !d)

  useEffect(() => {
    if (dark) document.documentElement.removeAttribute('data-dark')
    else document.documentElement.setAttribute('data-dark', '0')
  }, [dark])

  useEffect(() => {
    if (theme === 'warm') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <Nav
        name={portfolio.hero.name}
        dark={dark}
        onToggleDark={toggleDark}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main>
        <div id="hero">
          <Hero data={portfolio.hero} />
        </div>

        <Suspense fallback={null}>
          <motion.div id="about" {...REVEAL}>
            <About data={portfolio.about} />
          </motion.div>
        
          <motion.div id="projects" {...REVEAL}>
            <Projects projects={portfolio.projects} />
          </motion.div>
        
          <motion.div id="skills" {...REVEAL}>
            <Skills skills={portfolio.skills} />
          </motion.div>
        </Suspense>
      </main>
      
      <Footer />
    </>
  )
}
