export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const STAGGER_DELAY = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export const FADE_UP_SM = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}
