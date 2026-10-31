// A lowercase j drawn as a route: accent source node, path, and a destination ring at the hook.
export default function Logo({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="20" cy="5.5" r="3" fill="var(--color-accent)" />
    <path d="M20 11.5v9a6 6 0 0 1-12 0v-1.3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="8" cy="15.6" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
}
