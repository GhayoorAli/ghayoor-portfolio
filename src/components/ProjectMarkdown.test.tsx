import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ProjectMarkdown } from './ProjectMarkdown'

// tsx supports the repository's preserve JSX setting through the React runtime.
Object.assign(globalThis, { React })
const render = (value: string) => renderToStaticMarkup(React.createElement(ProjectMarkdown, { value, repository: 'https://github.com/example/demo' }))

test('full README renders arbitrary headings, nested lists, tables, details, and anchors', () => {
  const html = render('# Custom story\n\n[Jump](#benchmarks)\n\n## Benchmarks\n\n| Tool | Time |\n| --- | --- |\n| Rust | 1ms |\n\n- One\n  - Nested\n\n<details><summary>More</summary>Extra content</details>')
  for (const expected of ['Custom story', '<table>', '<details>', 'Nested', 'id="user-content-benchmarks"', 'href="#user-content-benchmarks"']) assert.ok(html.includes(expected), expected)
})

test('README scripts, event handlers, and javascript links are stripped', () => {
  const html = render('<script>alert(1)</script>\n\n<img src="x.png" onerror="alert(2)">\n\n[unsafe](javascript:alert%281%29)')
  assert.ok(!html.includes('<script'))
  assert.ok(!html.includes('onerror'))
  assert.ok(!html.includes('javascript:'))
})

test('relative repository assets resolve and code remains escaped', () => {
  const html = render('![Preview](docs/preview.png)\n\n[Guide](docs/guide.md)\n\n```html\n<script>literal</script>\n```')
  assert.ok(html.includes('https://raw.githubusercontent.com/example/demo/HEAD/docs/preview.png'))
  assert.ok(html.includes('https://github.com/example/demo/blob/HEAD/docs/guide.md'))
  assert.ok(html.includes('&lt;script&gt;literal&lt;/script&gt;'))
})

test('Mermaid fences use the shared diagram component regardless of heading', () => {
  const html = render('## Unexpected chart\n\n```mermaid\ngraph TD\nA --> B\n```')
  assert.ok(html.includes('class="project-diagram is-loading"'))
})
