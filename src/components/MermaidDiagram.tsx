'use client'

import { useEffect, useId, useRef, useState } from 'react'

type MermaidDiagramProps = {
  chart: string
  title?: string
}

let mermaidReady: Promise<typeof import('mermaid').default> | null = null

function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import('mermaid').then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'base',
        themeVariables: {
          primaryColor: '#ebe7ff',
          primaryTextColor: '#1c1638',
          primaryBorderColor: '#6d5cec',
          lineColor: '#5e5878',
          secondaryColor: '#e8f7f9',
          tertiaryColor: '#f8f7fb',
          background: '#fffcff',
          mainBkg: '#fffcff',
          nodeBorder: '#6d5cec',
          clusterBkg: '#f6f3ff',
          titleColor: '#1c1638',
          edgeLabelBackground: '#fffcff',
          actorBkg: '#ebe7ff',
          actorBorder: '#6d5cec',
          actorTextColor: '#1c1638',
          signalColor: '#5e5878',
          signalTextColor: '#1c1638',
          labelBoxBkgColor: '#f6f3ff',
          labelBoxBorderColor: '#6d5cec',
          labelTextColor: '#1c1638',
          noteBkgColor: '#e8f7f9',
          noteTextColor: '#1c1638',
          noteBorderColor: '#0ea5b8',
        },
        flowchart: { curve: 'basis', padding: 16 },
        sequence: {
          mirrorActors: false,
          useMaxWidth: true,
          width: 160,
          messageAlign: 'center',
        },
      })
      return mermaid
    })
  }
  return mermaidReady
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, '')
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    const renderId = `mermaid-${reactId}-${Math.random().toString(36).slice(2, 9)}`

    const run = async () => {
      const node = containerRef.current
      if (!node) return

      try {
        const mermaid = await getMermaid()
        const { svg } = await mermaid.render(renderId, chart.trim())
        if (cancelled || !containerRef.current) return

        containerRef.current.innerHTML = svg
        const svgEl = containerRef.current.querySelector('svg')
        if (svgEl) {
          svgEl.removeAttribute('height')
          svgEl.style.height = 'auto'
          svgEl.style.maxWidth = '100%'
          svgEl.setAttribute('width', '100%')
          svgEl.setAttribute('preserveAspectRatio', 'xMidYMin meet')
        }
        setStatus('ready')
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    void run()

    return () => {
      cancelled = true
      // Remove any leftover mermaid error/helper nodes from this attempt.
      document.getElementById(renderId)?.remove()
      document.getElementById(`d${renderId}`)?.remove()
    }
  }, [chart, reactId])

  if (status === 'error') {
    return (
      <pre className="project-diagram-fallback" aria-label={title ?? 'Diagram'}>
        {chart}
      </pre>
    )
  }

  return (
    <div
      className={`project-diagram${status === 'loading' ? ' is-loading' : ''}`}
      ref={containerRef}
      role="img"
      aria-label={title ?? 'Diagram'}
      aria-busy={status === 'loading'}
    />
  )
}
