'use client'

import { useSyncExternalStore } from 'react'

// Touch scrolling stays native; wheel smoothing is only useful on desktop.
const query = '(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
const getSnapshot = () => window.matchMedia(query).matches
const getServerSnapshot = () => false

export function useDesktopMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
