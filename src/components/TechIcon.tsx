import { LOCAL_ICON_SOURCES } from '@/lib/local-icons'

type TechIconProps = {
  id: string
  title: string
  src?: string
}

export function TechIcon({ id, title, src: customSrc }: TechIconProps) {
  const src = customSrc || LOCAL_ICON_SOURCES[id] || (/^(devicon|simple-icons)-[a-z0-9-]+$/.test(id) ? `/api/technology-icons/${id}` : undefined)
  const letter = title.replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase() || '?'

  if (!src) {
    return (
      <span className="stack-tool-fallback" aria-hidden="true">
        {letter}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      title={title}
      className="stack-tool-icon"
      loading="lazy"
      decoding="async"
      width={44}
      height={44}
    />
  )
}
