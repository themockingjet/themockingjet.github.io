export const THEMES = [
  { id: 'amber', label: 'Amber', accent: '#f59e0b' },
  { id: 'sage', label: 'Sage', accent: '#5e8a70' },
  { id: 'ocean', label: 'Ocean', accent: '#4a9eff' },
  { id: 'ember', label: 'Ember', accent: '#e07840' },
  { id: 'violet', label: 'Violet', accent: '#8b67e8' },
  { id: 'slate', label: 'Slate', accent: '#5b8fa8' },
] as const
export type ThemeId = (typeof THEMES)[number]['id']
