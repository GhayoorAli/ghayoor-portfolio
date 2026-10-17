import devicon from '@iconify-json/devicon/icons.json'
import simpleIcons from '@iconify-json/simple-icons/icons.json'

type Collection = { width?: number; height?: number; icons: Record<string, { body: string; width?: number; height?: number }> }

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let collection: Collection
  let key: string
  if (id.startsWith('devicon-')) { collection = devicon; key = id.slice(8) }
  else if (id.startsWith('simple-icons-')) { collection = simpleIcons; key = id.slice(13) }
  else return new Response('Unknown icon', { status: 404 })
  const icon = Object.hasOwn(collection.icons, key) ? collection.icons[key] : undefined
  if (!icon) return new Response('Unknown icon', { status: 404 })
  const width = icon.width ?? collection.width ?? 16
  const height = icon.height ?? collection.height ?? 16
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" color="#242620">${icon.body}</svg>`, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' },
  })
}
