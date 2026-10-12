import assert from 'node:assert/strict'
import { test } from 'node:test'
import { decodeExperienceDetails, encodeExperienceDetails, normalizeExperience } from './experience-content'
import { getFallbackContent } from './fallback-content'

const profile = getFallbackContent().experience
const lixup = profile.find(item => item.company === 'Lixup')!

test('structured experience details survive a database round trip', () => {
  const result = decodeExperienceDetails(encodeExperienceDetails(lixup))
  assert.deepEqual(result.sections, lixup.sections)
  assert.deepEqual(result.points, lixup.points)
  assert.equal(result.employment_type, 'Full-time')
  assert.equal(result.duration, '4 yrs')
})

test('legacy highlight arrays remain readable', () => {
  assert.deepEqual(decodeExperienceDetails(['First highlight', 'Second highlight']).points, ['First highlight', 'Second highlight'])
  assert.deepEqual(decodeExperienceDetails(null).points, [])
})

test('pasted responsibilities become grouped details, with a short timeline summary', () => {
  const summary = lixup.sections!.map(section => [section.title, ...section.points].join('\n')).join('\n\n')
  const result = normalizeExperience({ ...lixup, role: 'New roleFull Stack Developer', summary, points: [], sections: undefined, employment_type: undefined, duration: undefined }, profile)
  assert.equal(result.role, 'Full Stack Developer')
  assert.equal(result.summary, lixup.summary)
  assert.deepEqual(result.sections, lixup.sections)
  assert.deepEqual(result.points, lixup.points)
  assert.equal(result.employment_type, 'Full-time')
  assert.equal(result.duration, '4 yrs')
})

test('long custom descriptions are preserved when shortened on timeline cards', () => {
  const summary = 'This is a detailed description. ' + 'Additional project responsibilities and achievements. '.repeat(12)
  const result = normalizeExperience({ ...lixup, company: 'Another company', summary, sections: undefined, points: ['A separate highlight'] })
  assert.ok(result.summary.length <= 280)
  assert.ok(result.points.includes(summary.trim()))
  assert.ok(result.points.includes('A separate highlight'))
})

test('matching legacy profile highlights regain grouped formatting', () => {
  const result = normalizeExperience({ ...lixup, sections: undefined, employment_type: undefined, duration: undefined }, profile)
  assert.deepEqual(result.sections, lixup.sections)
  assert.equal(result.employment_type, 'Full-time')
})

test('explicitly cleared metadata stays cleared after saving', () => {
  const details = decodeExperienceDetails(encodeExperienceDetails({ ...lixup, duration: '', employment_type: '' }))
  const result = normalizeExperience({ ...lixup, ...details }, profile)
  assert.equal(result.duration, '')
  assert.equal(result.employment_type, '')
})

test('new pasted details are preserved alongside existing responsibility groups', () => {
  const summary = 'Laravel & PHP\nA newly added responsibility.\n' + 'Another new responsibility with detailed implementation context. '.repeat(6)
  const result = normalizeExperience({ ...lixup, summary }, profile)
  assert.ok(result.points.includes('A newly added responsibility.'))
  assert.ok(result.points.includes(lixup.points[0]))
  assert.equal(result.sections!.filter(section => section.title === 'Laravel & PHP').length, 1)
})
