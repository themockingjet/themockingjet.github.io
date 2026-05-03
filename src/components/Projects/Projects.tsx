import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { Icon } from '@iconify/react'
import styles from './Projects.module.css'
import type { ProjectData } from '../../lib/parsePortfolio'
import { resolveIcon } from '../../lib/icons'
import { EASE, STAGGER, FADE_UP } from '../../lib/motion'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:     { label: 'Active',     color: 'var(--status-active)' },
  beta:       { label: 'Beta',       color: 'var(--status-beta)' },
  deprecated: { label: 'Deprecated', color: 'var(--status-deprecated)' },
}

function resolveStatus(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, color: 'var(--text-muted)' }
}



interface ProjectsProps {
  projects: ProjectData[]
}

function StackTag({ tech }: { tech: string }) {
  const icon = resolveIcon(tech)
  return (
    <li className={styles.tag}>
      {icon && <Icon icon={icon} width={12} height={12} aria-hidden />}
      {tech}
    </li>
  )
}

function StatusBadge({ status }: { status: string }) {
  const resolved = resolveStatus(status)
  const dotColor = resolved.color
  return (
    <span className={styles.statusBadge} style={{ color: dotColor }} aria-label={`Status: ${resolved.label}`}>
      <span
        className={styles.statusDot}
        style={{
          background: dotColor,
          boxShadow: status !== 'deprecated' ? `0 0 5px ${dotColor}` : undefined,
        }}
      />
      {resolved.label}
    </span>
  )
}

/** Unified project card — featured gets a modifier class, clickable to expand */
function ProjectCard({ project, index, featured }: { project: ProjectData; index: number; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasLink = !!project.url && project.url !== '#'
  const hasDetails = project.details.length > 0
  const indexLabel = String(index).padStart(2, '0')
  const cardClass = [
    styles.card,
    featured ? styles.featuredCard : '',
    expanded ? styles.cardExpanded : '',
  ].filter(Boolean).join(' ')

  return (
    <motion.li className={cardClass} variants={FADE_UP}>
      <span className={styles.cornerBL} aria-hidden />
      <span className={styles.cornerBR} aria-hidden />
      <span className={styles.index}>{indexLabel}</span>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {hasLink ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.title}
              <Icon icon="lucide:arrow-up-right" width={14} height={14} className={styles.externalIcon} aria-hidden />
            </a>
          ) : (
            project.title
          )}
        </h2>
        {project.status && <StatusBadge status={project.status} />}
      </div>
      {project.description && (
        <p className={styles.description}>{project.description}</p>
      )}
      {hasDetails && (
        <button
          className={styles.expandBtn}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
        >
          <Icon
            icon={expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'}
            width={14}
            height={14}
            aria-hidden
          />
          {expanded ? 'Less' : 'Details'}
        </button>
      )}
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            className={styles.details}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.35, ease: EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
          >
            {project.details.map((d) => (
              <div key={d.heading} className={styles.detailBlock}>
                <h3 className={styles.detailHeading}>{d.heading}</h3>
                <p className={styles.detailBody}>{d.body}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {project.stack.length > 0 && (
        <ul className={styles.stack} role="list" aria-label="Tech stack">
          {project.stack.map((t) => <StackTag key={t} tech={t} />)}
        </ul>
      )}
    </motion.li>
  )
}

export default function Projects({ projects }: ProjectsProps) {
  const featured = projects.filter((p) => p.status !== 'deprecated')
  const archived = projects.filter((p) => p.status === 'deprecated')
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const decorY = useTransform(scrollYProgress, [0, 1], [80, -120])

  return (
    <section ref={sectionRef} className={styles.projects} aria-label="Projects">
      <motion.span className={styles.decor} aria-hidden="true" style={{ y: decorY }}>
        Projects
      </motion.span>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          Projects
        </motion.h2>

        {/* All active projects in a unified list */}
        {featured.length > 0 && (
          <motion.ul
            className={styles.grid}
            role="list"
            variants={STAGGER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featured.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i + 1}
                featured={i === 0}
              />
            ))}
          </motion.ul>
        )}

        {archived.length > 0 && (
          <>
            <div className={styles.archiveDivider}>
              <span>Archived</span>
            </div>
            <motion.ul
              className={`${styles.grid} ${styles.archivedList}`}
              role="list"
              variants={STAGGER}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {archived.map((project, i) => (
                <ProjectCard key={project.title} project={project} index={featured.length + i + 1} />
              ))}
            </motion.ul>
          </>
        )}
      </div>
    </section>
  )
}
