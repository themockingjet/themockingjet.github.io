import { render, screen } from '@testing-library/react'
import About from '../../../src/components/About/About'
import type { AboutData } from '../../../src/lib/parsePortfolio'

const mockData: AboutData = {
  personas: ['recruiter', 'developer'],
  slots: [
    {
      label: 'pitch',
      segments: [
        { type: 'text', value: 'I build ' },
        { type: 'slot', variants: ['fast', 'reliable'] },
        { type: 'text', value: ' systems.' },
      ],
    },
    {
      label: 'background',
      segments: [
        { type: 'text', value: 'From the Philippines.' },
      ],
    },
  ],
}

describe('About component', () => {
  beforeEach(() => {
    render(<About data={mockData} />)
  })

  describe('semantic structure', () => {
    it('should use a section element with About label', () => {
      expect(screen.getByLabelText('About').tagName).toBe('SECTION')
    })

    it('should render the heading as h2', () => {
      expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
    })
  })

  describe('content rendering', () => {
    it('should display text segments from slots', () => {
      expect(screen.getByText('I build')).toBeInTheDocument()
      expect(screen.getByText('From the Philippines.')).toBeInTheDocument()
    })

    it('should display the first variant of a slot by default', () => {
      expect(screen.getByText('fast')).toBeInTheDocument()
    })

    it('should display the active persona indicator', () => {
      expect(screen.getByText('recruiter')).toBeInTheDocument()
    })
  })
})
