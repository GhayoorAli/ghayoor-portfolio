import { ICON_BY_ID } from '@/lib/icon-catalog'

type TechIconProps = {
  id: string
  title: string
  src?: string
}

export function TechIcon({ id, title, src: customSrc }: TechIconProps) {
  const src = customSrc || ICON_BY_ID[id]?.src
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
      width={44}
      height={44}
    />
  )
}
