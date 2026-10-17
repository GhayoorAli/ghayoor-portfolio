import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseProjectReadme } from './project-readme'
import { ICON_OPTIONS, findIconByName } from './icon-catalog'

test('bundled icons cover new technologies without uploads and distinguish C variants', () => {
  assert.ok(ICON_OPTIONS.length > 3000)
  for (const name of ['Python', 'Rust', 'Kubernetes', 'C++', 'C#']) {
    assert.ok(findIconByName(name, ICON_OPTIONS), name)
  }
  assert.notEqual(findIconByName('C++', ICON_OPTIONS)?.id, findIconByName('C#', ICON_OPTIONS)?.id)
})

test('README technology tables detect bundled icons, versions, punctuation, and aliases', () => {
  const result = parseProjectReadme('# Demo\n\n## Technologies\n| Tool | Use |\n| --- | --- |\n| Python 3.12 | Service |\n| Rust | Worker |\n| C++ | Native |\n| C# | Client |\n| Next.js 16 | Web |\n| Postgres | Data |')
  for (const name of ['Python', 'Rust', 'C++', 'C#', 'Next.js', 'PostgreSQL']) {
    assert.ok(result.stack?.some(item => item.name === name), name)
  }
  assert.ok(!result.stack?.some(item => item.name === 'C'))
})

test('technology matching does not confuse substrings such as CSS and SCSS', () => {
  const result = parseProjectReadme('# Demo\n\n## Tech Stack\n- SCSS\n- React Native\n- Tailwind CSS')
  assert.ok(!result.stack?.some(item => item.name === 'CSS'))
  assert.ok(!result.stack?.some(item => item.name === 'React'))
  assert.ok(result.stack?.some(item => item.name === 'Tailwind CSS'))
})

test('arbitrary headings and incomplete portfolio markers still preserve content through apply', async () => {
  const { applyReadmeToProject } = await import('./project-readme')
  const { getFallbackContent } = await import('./fallback-content')
  const readme = '# An unusual story\n\n## Benchmarks 🧪\n\nCustom content.\n\n<!-- portfolio:start -->'
  const project = applyReadmeToProject(getFallbackContent().projects[0], readme)
  assert.equal(project.readme, readme)
})


test('technology detection also works without any Markdown headings', () => {
  const result = parseProjectReadme('Built with Python, Kubernetes, and PostgreSQL.')
  for (const name of ['Python', 'Kubernetes', 'PostgreSQL']) assert.ok(result.stack?.some(item => item.name === name), name)
})
