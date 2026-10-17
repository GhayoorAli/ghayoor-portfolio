import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const titles = { cplusplus: 'C++', csharp: 'C#', dotnet: '.NET', fsharp: 'F#', go: 'Go', python: 'Python', rust: 'Rust', angular: 'Angular', svelte: 'Svelte', kubernetes: 'Kubernetes', graphql: 'GraphQL', openai: 'OpenAI', scikitlearn: 'scikit-learn', tensorflow: 'TensorFlow', pytorch: 'PyTorch', fastapi: 'FastAPI', springboot: 'Spring Boot', reactnative: 'React Native', androidstudio: 'Android Studio', intellij: 'IntelliJ IDEA', visualstudio: 'Visual Studio', amazonwebservices: 'Amazon Web Services', googlecloud: 'Google Cloud', microsoftazure: 'Microsoft Azure', githubactions: 'GitHub Actions', unrealengine: 'Unreal Engine', opencv: 'OpenCV', jupyter: 'Jupyter', huggingface: 'Hugging Face', apachekafka: 'Apache Kafka', apachespark: 'Apache Spark' }
const options = []
const seen = new Set()
for (const collection of ['devicon', 'simple-icons']) {
  const { icons } = require(`@iconify-json/${collection}/icons.json`)
  for (const key of Object.keys(icons)) {
    // Prefer the full-color Devicon version when a technology exists in both collections.
    const name = key.replace(/-(?:original|plain|line|wordmark)(?:-wordmark)?$/, '')
    const normalized = name.replace(/[^a-z0-9]/g, '')
    if (seen.has(normalized)) continue
    seen.add(normalized)
    options.push({ id: `${collection}-${key}`, label: titles[name] ?? name.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '), src: `/api/technology-icons/${collection}-${key}` })
  }
}
options.sort((a, b) => a.label.localeCompare(b.label))
writeFileSync(new URL('../src/data/technology-icons.json', import.meta.url), JSON.stringify(options, null, 2) + '\n')
console.log(`Generated ${options.length} bundled technology icons.`)
