import type { ProjectData } from './parsePortfolio'

export interface RouteStop {
  project: ProjectData
  matchedInterests: string[]
}

/** Rank by the number of selected authored tags, preserving content order on ties. */
export function rankProjects(projects: ProjectData[], interests: string[], limit: number): RouteStop[] {
  const selected = new Set(interests)
  return projects
    .map((project, index) => ({ project, index, matchedInterests: project.interests.filter((tag) => selected.has(tag)) }))
    .filter((stop) => stop.matchedInterests.length > 0)
    .sort((a, b) => b.matchedInterests.length - a.matchedInterests.length || a.index - b.index)
    .slice(0, Math.max(0, limit))
    .map(({ project, matchedInterests }) => ({ project, matchedInterests }))
}

/** Generate a local briefing from the same authored data used by the UI. */
export function createBriefing(stops: RouteStop[], profileUrl: string): string {
  const lines = ['# Jet — selected work', '']
  for (const { project, matchedInterests } of stops) {
    lines.push(`## ${project.title}`, '', project.description, '', `Matched interests: ${matchedInterests.join(', ')}`, '')
    if (project.url) lines.push(`Repository: ${project.url}`, '')
  }
  lines.push(`Profile: ${profileUrl}`, '')
  return lines.join('\n')
}
