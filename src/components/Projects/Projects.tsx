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
