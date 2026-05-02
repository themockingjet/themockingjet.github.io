function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    if (key) data[key] = value
  }

  return { data, content: match[2] }
}


export interface HeroData {
  name: string
  title: string
  tagline: string
  location: string
  github: string
}

export interface ProjectDetail {
  heading: string
  body: string
}

export interface ProjectData {
  title: string
  status: string
  url: string
  stack: string[]
  description: string
  details: ProjectDetail[]
}

export interface SkillsData {
  stack: string[]
  others: string[]
}

export interface AboutSlot {
  label: string
  segments: Array<{ type: 'text'; value: string } | { type: 'slot'; variants: string[] }>
}

export type Segment = AboutSlot['segments'][number]

export interface AboutData {
  personas: string[]
  slots: AboutSlot[]
}

export interface PortfolioData {
  hero: HeroData
  about: AboutData
  projects: ProjectData[]
  skills: SkillsData
}

function splitByH2(body: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const parts = body.split(/^## /m)
  for (const part of parts) {
    const newline = part.indexOf('\n')
    if (newline === -1) continue
    const heading = part.slice(0, newline).trim().toLowerCase()
    sections[heading] = part.slice(newline + 1).trim()
  }
  return sections
}

function parseProjects(raw: string): ProjectData[] {
  const projects: ProjectData[] = []
  const blocks = raw.split(/^### /m).filter(Boolean)

  for (const block of blocks) {
    const lines = block.split('\n')
    const title = lines[0].trim()
    const meta: Record<string, string> = {}
    const descLines: string[] = []
    const details: ProjectDetail[] = []
    let inMeta = true
    let currentDetail: { heading: string; lines: string[] } | null = null

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (inMeta) {
        const metaMatch = line.match(/^(\w+):\s*(.+)/)
        if (metaMatch) {
          meta[metaMatch[1]] = metaMatch[2].trim()
          continue
        }
        if (line.trim() !== '') inMeta = false
      }
      if (!inMeta) {
        // Check for [detail heading] pattern
        const detailMatch = line.trim().match(/^\[(.+)\]$/)
        if (detailMatch) {
          if (currentDetail) {
            details.push({ heading: currentDetail.heading, body: currentDetail.lines.join('\n').trim() })
          }
          currentDetail = { heading: detailMatch[1], lines: [] }
        } else if (currentDetail) {
          currentDetail.lines.push(line)
        } else if (line.trim() !== '' || descLines.length > 0) {
          descLines.push(line)
        }
      }
    }

    if (currentDetail) {
      details.push({ heading: currentDetail.heading, body: currentDetail.lines.join('\n').trim() })
    }

    const stack = meta.stack
      ? meta.stack.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    projects.push({
      title,
      status: meta.status ?? '',
      url: meta.url ?? '',
      stack,
      description: descLines.join('\n').trim(),
      details,
    })
  }

  return projects
}

function parseSegments(text: string): AboutSlot['segments'] {
  const parts: AboutSlot['segments'] = []
  const re = /\{([^}]+)\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    parts.push({ type: 'slot', variants: m[1].split('|').map((s) => s.trim()) })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

function parseAbout(raw: string): AboutData {
  const personas: string[] = []
  const slots: AboutSlot[] = []
  const lines = raw.split('\n')
  let i = 0

  // Scan for personas: line
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line.startsWith('personas:')) {
      personas.push(...line.slice('personas:'.length).split(',').map((p) => p.trim()).filter(Boolean))
      i++
      break
    }
    if (line !== '') break
    i++
  }

  // Parse [label] blocks
  while (i < lines.length) {
    const line = lines[i].trim()
    const labelMatch = line.match(/^\[([^\]]+)\]$/)
    if (labelMatch) {
      const label = labelMatch[1]
      i++
      const textLines: string[] = []
      while (i < lines.length) {
        const next = lines[i].trim()
        if (next.match(/^\[\w+\]$/)) break
        if (next !== '') textLines.push(next)
        i++
      }
      const text = textLines.join(' ')
      if (text) slots.push({ label, segments: parseSegments(text) })
    } else {
      i++
    }
  }

  return { personas, slots }
}

function parseSkills(raw: string): SkillsData {
  const result: SkillsData = { stack: [], others: [] }
  const blocks = raw.split(/^### /m).filter(Boolean)

  if (blocks.length === 0) {
    // Flat list — no H3 grouping
    result.stack = raw.split(',').map((s) => s.trim()).filter(Boolean)
    return result
  }

  for (const block of blocks) {
    const newline = block.indexOf('\n')
    const heading = block.slice(0, newline).trim().toLowerCase()
    const content = block.slice(newline + 1).trim()
    const items = content.split(',').map((s) => s.trim()).filter(Boolean)

    if (heading === 'stack') result.stack = items
    else result.others = [...result.others, ...items]
  }

  return result
}

// Main parser

export function parsePortfolio(raw: string): PortfolioData {
  const { data, content } = parseFrontmatter(raw)
  const sections = splitByH2(content)

  return {
    hero: {
      name: data.name ?? '',
      title: data.title ?? '',
      tagline: data.tagline ?? '',
      location: data.location ?? '',
      github: data.github ?? '',
    },
    about: parseAbout(sections['about'] ?? ''),
    projects: parseProjects(sections['projects'] ?? ''),
    skills: parseSkills(sections['skills'] ?? ''),
  }
}
