import { AnimatePresence, motion, wrap } from 'framer-motion'
import { useEffect, useState, type KeyboardEvent } from 'react'

type ProjectGalleryProps = {
  images: string[]
  projectName: string
}

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [[page, direction], setPage] = useState([0, 0])
  const index = wrap(0, images.length, page)

  const paginate = (dir: number) => {
    setPage(([current]) => [current + dir, dir])
  }

  const goTo = (next: number) => {
    setPage(([current]) => [next, next > current ? 1 : -1])
  }

  useEffect(() => {
    setPage([0, 0])
  }, [images])

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
      <div className="project-carousel-stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.figure
            key={page}
            className="project-carousel-slide"
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 48 : -48,
                opacity: 0,
                scale: 0.985,
              }),
              center: {
                x: 0,
                opacity: 1,
                scale: 1,
              },
              exit: (dir: number) => ({
                x: dir < 0 ? 48 : -48,
                opacity: 0,
                scale: 0.985,
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
            <img src={images[index]} alt={`${projectName} screenshot ${index + 1} of ${images.length}`} />
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
        <p className="project-carousel-count">
          {index + 1} <span>/ {images.length}</span>
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
        <div className="project-carousel-thumbs" aria-hidden="true">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`project-carousel-thumb${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
              tabIndex={-1}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
