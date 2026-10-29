import { useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './Projects.module.css'
import type { ProjectData } from '../../lib/parsePortfolio'
import { resolveIcon } from '../../lib/icons'

function ProjectCard({ project, index, featured }: { project: ProjectData; index: number; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasLink = !!project.url && project.url !== '#'
  const detailsId = `details-${project.id}`
  const cardClass = [styles.card, featured ? styles.featuredCard : '', expanded ? styles.cardExpanded : ''].filter(Boolean).join(' ')
  return <li id={`project-${project.id}`} className={cardClass}>
    <span className={styles.cornerBL} aria-hidden/><span className={styles.cornerBR} aria-hidden/><span className={styles.index}>{String(index).padStart(2, '0')}</span>
    <div className={styles.cardHeader}><h3 className={styles.cardTitle}>{hasLink ? <a href={project.url} target="_blank" rel="noopener noreferrer">{project.title}<Icon icon="lucide:arrow-up-right" width={14} height={14} className={styles.externalIcon} aria-hidden/></a> : project.title}</h3>{project.status && <span className={styles.statusBadge}> {project.status}</span>}</div>
    {featured && <figure className={styles.signalFigure}>
      <svg viewBox="0 0 800 250" role="img" aria-labelledby="signal-title signal-caption" preserveAspectRatio="none">
        <title id="signal-title">Illustrative event signal</title>
        <text x="28" y="36" className={styles.signalLabel}>Signal → decision → action</text>
        <path d="M0 198 L55 188 L94 210 L144 144 L192 166 L245 82 L284 112 L337 74 L372 128 L414 70 L462 91 L520 26 L566 54 L622 0 L676 38 L721 8 L800 23 V250 H0 Z" className={styles.signalFill}/>
        <path d="M0 198 L55 188 L94 210 L144 144 L192 166 L245 82 L284 112 L337 74 L372 128 L414 70 L462 91 L520 26 L566 54 L622 0 L676 38 L721 8 L800 23" className={styles.signalLine}/>
        <text id="signal-caption" x="28" y="230" className={styles.signalCaption}>Illustrative signal / not live market data</text>
      </svg>
    </figure>}
    {project.description && <p className={styles.description}>{project.description}</p>}
    {project.details.length > 0 && <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={detailsId} aria-label={expanded ? `Collapse details for ${project.title}` : `Expand details for ${project.title}`}>{expanded ? 'Less' : 'Details'}</button>}
    <div id={detailsId} className={styles.details} hidden={!expanded}>{project.details.map((detail) => <div key={detail.heading} className={styles.detailBlock}><h4 className={styles.detailHeading}>{detail.heading}</h4><p className={styles.detailBody}>{detail.body}</p></div>)}</div>
    {project.stack.length > 0 && <ul className={styles.stack} role="list" aria-label="Tech stack">{project.stack.map((tech) => { const icon = resolveIcon(tech); return <li key={tech} className={styles.tag}>{icon && <Icon icon={icon} width={12} height={12} aria-hidden/>}{tech}</li> })}</ul>}
  </li>
}
export default function Projects({ projects }: { projects: ProjectData[] }) {
  const featured = projects.filter((project) => project.status !== 'deprecated')
  const archived = projects.filter((project) => project.status === 'deprecated')
  return <section className={styles.projects} aria-label="Projects"><div className={styles.inner}><h2 className={styles.heading}>Projects</h2>
    <ul className={styles.grid} role="list">{featured.map((project, i) => <ProjectCard key={project.id} project={project} index={i + 1} featured={i === 0}/>)}</ul>
    {archived.length > 0 && <><div className={styles.archiveDivider}><span>Archived</span></div><ul className={`${styles.grid} ${styles.archivedList}`} role="list">{archived.map((project, i) => <ProjectCard key={project.id} project={project} index={featured.length + i + 1}/>)}</ul></>}
  </div></section>
}
