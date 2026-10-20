import { Children, isValidElement, type ReactNode } from 'react'
import Markdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'
import { MermaidDiagram } from './MermaidDiagram'

function textContent(children: ReactNode): string {
  return Children.toArray(children).map(child => isValidElement<{ children?: ReactNode }>(child)
    ? textContent(child.props.children) : String(child)).join('')
}

function resolveUrl(url: string, repository?: string | null, image = false) {
  if (url.startsWith('#')) return `#user-content-${url.slice(1)}`
  if (!url || url.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(url)) return defaultUrlTransform(url)
  const match = repository?.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (!match) return defaultUrlTransform(url)
  const repo = `${match[1]}/${match[2].replace(/\.git$/, '')}`
  return new URL(url, image ? `https://raw.githubusercontent.com/${repo}/HEAD/` : `https://github.com/${repo}/blob/HEAD/`).href
}

export function ProjectMarkdown({ value, repository }: { value: string; repository?: string | null }) {
  return <div className="project-markdown">
    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug, rehypeSanitize]}
      urlTransform={(url, key) => resolveUrl(url, repository, key === 'src')}
      components={{
        pre({ children }) {
          const code = Children.toArray(children).find(child => isValidElement(child))
          if (isValidElement<{ className?: string; children?: ReactNode }>(code) && /\blanguage-mermaid\b/.test(code.props.className ?? '')) {
            return <MermaidDiagram chart={textContent(code.props.children)} title="README diagram" />
          }
          return <pre>{children}</pre>
        },
        table({ children }) { return <div className="project-markdown-table"><table>{children}</table></div> },
        a({ href, children, node: _node, ...props }) { return <a {...props} href={href} target={href?.startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer">{children}</a> },
        img({ src, alt, node: _node, ...props }) { return <img {...props} src={src} alt={alt ?? ''} loading="lazy" decoding="async" /> },
      }}
    >{value}</Markdown>
  </div>
}
