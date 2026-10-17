import type { FAQItem, SiteSettings, WorkflowItem } from '@/types/content'

export function getDefaultFAQs(site: Pick<SiteSettings, 'email'>, workflow: WorkflowItem[]): FAQItem[] {
  return [
    { question: 'What kind of projects do you build?', answer: 'Full-stack web applications, commerce platforms, APIs, and content-driven websites. My work connects considered interfaces with reliable backend systems.' },
    { question: 'Do you work on both frontend and backend?', answer: 'Yes. My stack spans PHP, Laravel, Magento and WordPress on the backend, with React, Next.js, Vue.js and modern JavaScript on the frontend.' },
    { question: 'Can you improve an existing application?', answer: 'Yes. My experience includes modernizing legacy code, optimizing database queries, integrating APIs, and improving frontend usability and performance.' },
    { question: 'How do you approach a new project?', answer: workflow.map(step => `${step.title}: ${step.text}`).join(' ') },
    { question: 'Where can I see your code?', answer: 'You can find my GitHub through the sidebar and explore the technologies, architecture and implementation details on each project page.' },
    { question: 'How can we discuss a project or role?', answer: `Email me at ${site.email}, or connect through one of my social profiles. Tell me what you are building and how I can help.` },
  ]
}

export function validateFAQs(input: unknown): FAQItem[] {
  if (!Array.isArray(input)) throw new Error('Invalid FAQ list.')
  return input.map((item, index) => {
    if (!item || typeof item.question !== 'string' || typeof item.answer !== 'string') {
      throw new Error(`Question ${index + 1} needs a question and an answer.`)
    }
    const question = item.question.trim(), answer = item.answer.trim()
    if (!question || !answer) throw new Error(`Question ${index + 1} needs a question and an answer.`)
    return { question, answer }
  })
}
