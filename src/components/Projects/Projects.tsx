import { useEffect, useState, type CSSProperties } from 'react'
import styles from './Projects.module.css'
import type { ProjectData } from '../../lib/parsePortfolio'

const COMPACT = '(max-width: 900px)'
const STATUS: Record<string, string> = { active: 'Running', beta: 'In beta', deprecated: 'Retired' }

function useCompact() {
  const [compact, setCompact] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia(COMPACT).matches)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(COMPACT)
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return compact
}

function Flow({ steps }: { steps: string[] }) {
  return <ol className={styles.flow} aria-label="How it runs" style={{ '--steps': steps.length } as CSSProperties}>
    {steps.map((step, index) => <li key={step} style={{ '--i': index } as CSSProperties}><span className={styles.node} aria-hidden/>{step}</li>)}
  </ol>
}

function Run({ project }: { project: ProjectData }) {
  const [open, setOpen] = useState(false)
  const impact = project.details.find((detail) => detail.heading.toLowerCase() === 'impact')
  const background = project.details.filter((detail) => detail !== impact)
  const hasLink = !!project.url && project.url !== '#'
  const status = STATUS[project.status] ?? project.status
  return <article id={`run-${project.id}`} className={styles.run} aria-labelledby={`run-title-${project.id}`}>
    <header className={styles.runHeader}>
      <h3 id={`run-title-${project.id}`}>{project.title}</h3>
      {status && <p className={styles.status}>{status}</p>}
    </header>
    {project.description && <p className={styles.summary}>{project.description}</p>}
    {project.flow.length > 0 && <Flow steps={project.flow}/>}
    <div className={styles.facts}>
      {impact && <div><h4>Impact</h4><p className={styles.impact}>{impact.body}</p></div>}
      {project.stack.length > 0 && <div><h4>Built with</h4><p>{project.stack.join(', ')}</p></div>}
    </div>
    <div className={styles.actions}>
      {background.length > 0 && <button type="button" className={styles.more} aria-expanded={open} aria-controls={`background-${project.id}`} onClick={() => setOpen(!open)}>{open ? 'Hide context and decisions' : 'Show context and decisions'}</button>}
      {hasLink && <a className={styles.source} href={project.url} target="_blank" rel="noopener noreferrer">View source on GitHub</a>}
    </div>
    <div id={`background-${project.id}`} className={styles.disclosure} aria-hidden={!open} inert={!open}>
      <div className={styles.background}>{background.map((detail) => <div key={detail.heading}><h4>{detail.heading}</h4><p>{detail.body}</p></div>)}</div>
    </div>
  </article>
}

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const compact = useCompact()
  const [selected, setSelected] = useState(projects[0]?.id ?? '')
  const live = projects.filter((project) => project.status !== 'deprecated')
  const retired = projects.filter((project) => project.status === 'deprecated')
  const current = projects.find((project) => project.id === selected)

  useEffect(() => {
    const follow = () => {
      const id = window.location.hash.replace(/^#project-/, '')
      if (id !== window.location.hash && projects.some((project) => project.id === id)) setSelected(id)
    }
    follow()
    window.addEventListener('hashchange', follow)
    return () => window.removeEventListener('hashchange', follow)
  }, [projects])

  const station = (project: ProjectData) => {
    const active = project.id === selected
    return <li key={project.id} id={`project-${project.id}`} className={styles.stop}>
      <button type="button" className={styles.pick} aria-expanded={active} aria-controls={active ? `run-${project.id}` : undefined} onClick={() => setSelected(project.id)}>
        <span className={styles.station} aria-hidden/>{project.title}
      </button>
      {compact && active && <Run key={project.id} project={project}/>}
    </li>
  }

  return <section className={styles.projects} aria-label="Projects">
    <div className={styles.layout}>
      <div className={styles.index}>
        <h2 className={styles.heading}>Projects</h2>
        <ul role="list">{live.map(station)}</ul>
        {retired.length > 0 && <><h3 className={styles.group}>Retired</h3><ul role="list">{retired.map(station)}</ul></>}
      </div>
      {!compact && current && <Run key={current.id} project={current}/>}
    </div>
  </section>
}
