'use client'

import { AnimatePresence, motion, wrap } from 'framer-motion'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useImageResolution } from './useImageResolution'

type ProjectGalleryProps = {
  images: string[]
  projectName: string
}

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [[page, direction], setPage] = useState([0, 0])
  const index = wrap(0, images.length, page)
  const imageRef = useRef<HTMLImageElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const imageSize = useImageResolution(images[index] || '', imageRef)

  useEffect(() => {
    const rail = thumbsRef.current
    if (!rail) return
    const revealSelection = () => {
      const selected = rail.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (!selected) return
      const bounds = rail.getBoundingClientRect()
      const item = selected.getBoundingClientRect()
      const bottom = bounds.top + rail.clientHeight
      const right = bounds.left + rail.clientWidth
      const top = item.top < bounds.top ? item.top - bounds.top : item.bottom > bottom ? item.bottom - bottom : 0
      const left = item.left < bounds.left ? item.left - bounds.left : item.right > right ? item.right - right : 0
      if (top || left) rail.scrollBy({ top, left, behavior: 'instant' })
    }
    revealSelection()
    const observer = new ResizeObserver(revealSelection)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [index, images.length])

  const paginate = (dir: number) => {
    setPage(([current]) => [current + dir, dir])
  }

  const goTo = (next: number) => {
    setPage(([current]) => [next, next > wrap(0, images.length, current) ? 1 : -1])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      paginate(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      paginate(-1)
    }
  }

  if (images.length === 0) return null

  return (
    <div
      className="project-carousel"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${projectName} screenshots`}
      onKeyDown={onKeyDown}
    >
      <div className="project-carousel-stage"><span className="case-gallery-label">{projectName} / Interface {String(index + 1).padStart(2, '0')}</span>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.figure
            key={page}
            className="project-carousel-slide"
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 48 : -48,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
                scale: 1,
              },
              exit: (dir: number) => ({
                x: dir < 0 ? 48 : -48,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -400) paginate(1)
              else if (info.offset.x > 64 || info.velocity.x > 400) paginate(-1)
            }}
          >
            <img draggable={false} style={{ maxWidth: imageSize.width ? `min(100%, ${imageSize.width}px)` : '100%' }} src={images[index]} ref={imageRef} alt={`${projectName} screenshot ${index + 1} of ${images.length}`} />
          </motion.figure>
        </AnimatePresence>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="project-carousel-nav is-prev"
              aria-label="Previous screenshot"
              onClick={() => paginate(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="project-carousel-nav is-next"
              aria-label="Next screenshot"
              onClick={() => paginate(1)}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      <div className="project-carousel-meta">
        <p className="project-carousel-count" aria-live="polite" aria-atomic="true">
          {String(index + 1).padStart(2, '0')} <span>/ {String(images.length).padStart(2, '0')}</span>
        </p>
        {images.length > 1 ? (
          <div className="project-carousel-dots" role="tablist" aria-label="Screenshot slides">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show screenshot ${i + 1}`}
                className={i === index ? 'is-active' : ''}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="project-carousel-thumbs" ref={thumbsRef} role="group" aria-label="Screenshot thumbnails">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`project-carousel-thumb${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`View screenshot ${i + 1}`}
              aria-pressed={i === index}
            >
              <img src={src} alt="" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
