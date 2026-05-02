import { parsePortfolio } from '../../../src/lib/parsePortfolio'

const MINIMAL_MD = `---
name: Test User
title: Engineer
tagline: Building things
location: Earth
github: testuser
---

## About

personas: recruiter, developer

[pitch]
I build {fast|reliable} systems.

[background]
From {Manila|the Philippines}.

## Projects

### Project Alpha
status: active
url: https://example.com
stack: React, TypeScript

A tool that does things.

[Context]
Needed a solution for X.

[What It Does]
Solves X by doing Y.

[Key Decisions]
Chose React for speed.

### Project Beta
status: beta
stack: Python

Another project.

## Skills

### Stack
Python, JavaScript, TypeScript

### Others
Azure, Copilot
`

describe('parsePortfolio', () => {
  const data = parsePortfolio(MINIMAL_MD)

  describe('given a valid markdown portfolio', () => {
    describe('hero section', () => {
      it('should extract the name from frontmatter', () => {
        expect(data.hero.name).toBe('Test User')
      })

      it('should extract the title', () => {
        expect(data.hero.title).toBe('Engineer')
      })

      it('should extract the tagline', () => {
        expect(data.hero.tagline).toBe('Building things')
      })

      it('should extract the location', () => {
        expect(data.hero.location).toBe('Earth')
      })

      it('should extract the github username', () => {
        expect(data.hero.github).toBe('testuser')
      })
    })

    describe('about section', () => {
      it('should parse personas as an array', () => {
        expect(data.about.personas).toEqual(['recruiter', 'developer'])
      })

      it('should parse named slots with labels', () => {
        expect(data.about.slots).toHaveLength(2)
        expect(data.about.slots[0].label).toBe('pitch')
        expect(data.about.slots[1].label).toBe('background')
      })

      it('should parse text segments within a slot', () => {
        const pitch = data.about.slots[0]
        expect(pitch.segments[0]).toEqual({ type: 'text', value: 'I build ' })
      })

      it('should parse slot variants from curly brace syntax', () => {
        const pitch = data.about.slots[0]
        const slot = pitch.segments.find(s => s.type === 'slot')
        expect(slot).toBeDefined()
        if (slot?.type === 'slot') {
          expect(slot.variants).toEqual(['fast', 'reliable'])
        }
      })
    })

    describe('projects section', () => {
      it('should parse the correct number of projects', () => {
        expect(data.projects).toHaveLength(2)
      })

      it('should parse project metadata (title, status, url, stack)', () => {
        expect(data.projects[0].title).toBe('Project Alpha')
        expect(data.projects[0].status).toBe('active')
        expect(data.projects[0].url).toBe('https://example.com')
        expect(data.projects[0].stack).toEqual(['React', 'TypeScript'])
      })

      it('should parse the project description', () => {
        expect(data.projects[0].description).toBe('A tool that does things.')
      })

      it('should parse project detail blocks with headings and bodies', () => {
        expect(data.projects[0].details).toHaveLength(3)
        expect(data.projects[0].details[0].heading).toBe('Context')
        expect(data.projects[0].details[0].body).toBe('Needed a solution for X.')
      })

      it('should default url to empty string when not specified', () => {
        expect(data.projects[1].url).toBe('')
      })
    })

    describe('skills section', () => {
      it('should parse stack skills as an array', () => {
        expect(data.skills.stack).toEqual(['Python', 'JavaScript', 'TypeScript'])
      })

      it('should parse other skills as an array', () => {
        expect(data.skills.others).toEqual(['Azure', 'Copilot'])
      })
    })
  })

  describe('given edge cases', () => {
    it('should handle empty input gracefully', () => {
      const data = parsePortfolio('')
      expect(data.hero.name).toBe('')
      expect(data.projects).toEqual([])
      expect(data.skills.stack).toEqual([])
    })

    it('should handle markdown without frontmatter', () => {
      const data = parsePortfolio('## About\n\n[pitch]\nHello world.')
      expect(data.hero.name).toBe('')
      expect(data.about.slots).toHaveLength(1)
    })
  })
})
