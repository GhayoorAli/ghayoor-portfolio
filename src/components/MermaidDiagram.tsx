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
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          primaryColor: '#dedbc9',
          primaryTextColor: '#161713',
          primaryBorderColor: '#696956',
          lineColor: '#696956',
          secondaryColor: '#ffffb3',
          tertiaryColor: '#efeddf',
          background: '#efeddf',
          mainBkg: '#efeddf',
          nodeBorder: '#696956',
          clusterBkg: '#e2dfcc',
          titleColor: '#161713',
          edgeLabelBackground: '#efeddf',
          actorBkg: '#dedbc9',
          actorBorder: '#696956',
          actorTextColor: '#161713',
          signalColor: '#696956',
          signalTextColor: '#161713',
          labelBoxBkgColor: '#e2dfcc',
          labelBoxBorderColor: '#696956',
          labelTextColor: '#161713',
          noteBkgColor: '#ffffb3',
          noteTextColor: '#161713',
          noteBorderColor: '#8f8e51',
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
    setStatus('loading')
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
          svgEl.style.maxWidth = svgEl.style.maxWidth || '100%'
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

  return (
    <>
    {status === 'error' && <pre className="project-diagram-fallback" aria-label={title ?? 'Diagram'}>{chart}</pre>}
    <div
      hidden={status === 'error'}
      className={`project-diagram${status === 'loading' ? ' is-loading' : ''}`}
      ref={containerRef}
      role="img"
      aria-label={title ?? 'Diagram'}
      aria-busy={status === 'loading'}
    />
    </>
  )
}
