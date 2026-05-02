export type StatusKey = 'active' | 'beta' | 'deprecated'

export interface StatusConfig {
  label: string
  color: string
}

const STATUS_MAP: Record<StatusKey, StatusConfig> = {
  active: {
    label: 'Active',
    color: 'var(--status-active)',
  },
  beta: {
    label: 'Beta',
    color: 'var(--status-beta)',
  },
  deprecated: {
    label: 'Deprecated',
    color: 'var(--status-deprecated)',
  },
}

export function resolveStatus(status: string): StatusConfig {
  return STATUS_MAP[status as StatusKey] ?? { label: status, color: 'var(--text-muted)' }
}
