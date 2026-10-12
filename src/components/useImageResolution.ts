'use client'

import { useEffect, useState, type RefObject } from 'react'

/** Keep raster previews within their actual resolution, including Retina screens. */
export function useImageResolution(src: string, ref: RefObject<HTMLImageElement | null>) {
  const [size, setSize] = useState<{ width?: number; ratio?: number }>({})
  useEffect(() => {
    const image = ref.current
    if (!image) return
    const measure = () => {
      if (!image.naturalWidth || !image.naturalHeight) return
      const width = src.split('?')[0].endsWith('.svg') ? undefined : image.naturalWidth / Math.max(1, window.devicePixelRatio)
      const ratio = image.naturalWidth / image.naturalHeight
      setSize(current => current.width === width && current.ratio === ratio ? current : { width, ratio })
    }
    const frame = requestAnimationFrame(measure)
    image.addEventListener('load', measure)
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(frame); image.removeEventListener('load', measure); window.removeEventListener('resize', measure) }
  }, [src, ref])
  return size
}
