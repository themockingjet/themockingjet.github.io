import { createBriefing, rankProjects } from '../../../src/lib/route'
import type { ProjectData } from '../../../src/lib/parsePortfolio'

const project = (id: string, interests: string[], url = ''): ProjectData => ({
  id, interests, title: id, status: '', url, stack: [], description: `${id} description`, details: [],
})

describe('route planning', () => {
  const projects = [project('one', ['automation']), project('two', ['backend', 'automation'], 'https://example.com'), project('three', ['backend'])]

  it('ranks matches deterministically and preserves authored order for ties', () => {
    const result = rankProjects(projects, ['automation', 'backend', 'automation'], 3)
    expect(result.map(({ project }) => project.id)).toEqual(['two', 'one', 'three'])
    expect(result[0].matchedInterests).toEqual(['backend', 'automation'])
    expect(rankProjects(projects, ['unknown'], 3)).toEqual([])
    expect(rankProjects(projects, ['backend'], 1)).toHaveLength(1)
  })

  it('exports authored descriptions and only existing repository links', () => {
    const brief = createBriefing(rankProjects(projects, ['automation'], 3), 'https://example.org/profile')
    expect(brief).toContain('two description')
    expect(brief).toContain('Matched interests: automation')
    expect(brief).toContain('Repository: https://example.com')
    expect(brief).toContain('Profile: https://example.org/profile')
    expect(brief.match(/Repository:/g)).toHaveLength(1)
  })
})
