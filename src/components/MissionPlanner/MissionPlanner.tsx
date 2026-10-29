import { useState } from 'react'
import type { ProjectData } from '../../lib/parsePortfolio'
import { createBriefing, rankProjects, type RouteStop } from '../../lib/route'
import styles from './MissionPlanner.module.css'

interface Props { projects: ProjectData[]; profileUrl: string }

export default function MissionPlanner({ projects, profileUrl }: Props) {
  const interests = [...new Set(projects.flatMap((project) => project.interests))]
  const [selected, setSelected] = useState<string[]>(['automation'])
  const [limit, setLimit] = useState(3)
  const [guided, setGuided] = useState<RouteStop[]>([])
  const [index, setIndex] = useState(0)
  const route = rankProjects(projects, selected, limit)

  function toggle(tag: string) {
    setSelected((previous) => previous.includes(tag) ? previous.filter((item) => item !== tag) : [...previous, tag])
  }

  function visit(stop: RouteStop) {
    window.location.hash = `project-${stop.project.id}`
  }

  function download() {
    const url = URL.createObjectURL(new Blob([createBriefing(route, profileUrl)], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'jet-mission-brief.md'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <section className={styles.planner} aria-labelledby="route-heading">
      <div className={styles.inner}>
        <div className={styles.heading}><div><p className={styles.eyebrow}>Your flight plan</p><h2 id="route-heading">Choose your trajectory.</h2></div><p>Pick your interests and build a route through the work.</p></div>
        <div className={styles.columns}>
          <div className={styles.controls}>
            <fieldset className={styles.interests}>
              <legend>What would you like to explore?</legend>
              {interests.map((tag) => <label key={tag}><input type="checkbox" checked={selected.includes(tag)} onChange={() => toggle(tag)} /> <span>{tag.replaceAll('-', ' ')}</span></label>)}
            </fieldset>
            <label className={styles.length}>Visit length <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}><option value={1}>Quick visit</option><option value={3}>Explore more</option><option value={projects.length}>See everything</option></select></label>
            <p className={styles.note}>A curated path through real projects. Change direction whenever you like, or keep exploring everything.</p>
          </div>
          <div>
            <div className={styles.preview} aria-live="polite">
              <h3>Your suggested route <span>{route.length} {route.length === 1 ? 'destination' : 'destinations'}</span></h3>
              {route.length ? <ol>{route.map(({ project, matchedInterests }) => <li key={project.id}><a href={`#project-${project.id}`}>{project.title}</a><p>{project.description}</p><p>Matches: {matchedInterests.join(', ')}</p></li>)}</ol> : <p>Select an interest to see matching projects.</p>}
            </div>
            <div className={styles.actions}>
              <button disabled={!route.length} onClick={() => { setGuided(route); setIndex(0); visit(route[0]) }}>Start guided route</button>
              <button disabled={!route.length} onClick={download}>Download briefing</button>
            </div>
          </div>
        </div>
        {guided.length > 0 && <div className={styles.guided} role="region" aria-label="Guided route"><span>Route {index + 1} of {guided.length}: {guided[index].project.title}</span><button onClick={() => { if (index + 1 === guided.length) setGuided([]); else { setIndex(index + 1); visit(guided[index + 1]) } }}>{index + 1 === guided.length ? 'Finish route' : 'Next project'}</button><button onClick={() => setGuided([])}>Exit route</button></div>}
      </div>
    </section>
  )
}
