'use client'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
}

function renderMarkdown(readme: string) {
  if (!readme.trim()) {
    return '<p class="admin-md-empty">Nothing to preview yet.</p>'
  }

  const parts: string[] = []
  const chunks = readme.split(/(```[\s\S]*?```)/g)

  for (const chunk of chunks) {
    const fence = chunk.match(/^```(\w+)?\n?([\s\S]*?)```$/)
    if (fence) {
      const lang = fence[1] ?? ''
      const code = escapeHtml(fence[2].trimEnd())
      parts.push(`<pre class="admin-md-pre"><code class="language-${escapeHtml(lang)}">${code}</code></pre>`)
      continue
    }

    const lines = chunk.split('\n')
    let list: string[] = []
    const flushList = () => {
      if (!list.length) return
      parts.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`)
      list = []
    }

    for (const line of lines) {
      const heading = line.match(/^(#{1,6})\s+(.+)$/)
      if (heading) {
        flushList()
        const level = heading[1].length
        parts.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
        continue
      }
      const bullet = line.match(/^\s*[-*+]\s+(.+)$/)
      if (bullet) {
        list.push(bullet[1])
        continue
      }
      flushList()
      if (!line.trim()) continue
      parts.push(`<p>${inlineMarkdown(line)}</p>`)
    }
    flushList()
  }

  return parts.join('')
}

export function ReadmePreview({ value }: { value: string }) {
  return (
    <div className="admin-md-preview">
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
      {/```mermaid/i.test(value) ? (
        <p className="admin-md-note">Mermaid diagrams render on the public project page.</p>
      ) : null}
    </div>
  )
}
