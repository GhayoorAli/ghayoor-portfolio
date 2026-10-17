import assert from 'node:assert/strict'
import test from 'node:test'
import { getDefaultFAQs, validateFAQs } from './faq-content'

test('FAQ saves keep edited order, trim edges, and preserve answer paragraphs', () => {
  assert.deepEqual(validateFAQs([
    { question: ' Second? ', answer: ' Line one\n\nLine two ' },
    { question: 'First?', answer: 'Answer' },
  ]), [{ question: 'Second?', answer: 'Line one\n\nLine two' }, { question: 'First?', answer: 'Answer' }])
})

test('saving no FAQs intentionally keeps the list empty', () => {
  assert.deepEqual(validateFAQs([]), [])
})

test('FAQ saves reject malformed or blank entries before writing', () => {
  for (const invalid of [null, {}, [null], [{ question: 'Question', answer: '  ' }], [{ question: 123, answer: 'Answer' }]]) {
    assert.throws(() => validateFAQs(invalid))
  }
})

test('default FAQs preserve the site email and workflow until first save', () => {
  const faqs = getDefaultFAQs({ email: 'hello@example.com' }, [{ step: '01', title: 'Discover', text: 'Discuss goals.' }])
  assert.equal(faqs.length, 6)
  assert.match(faqs[3].answer, /Discover: Discuss goals\./)
  assert.match(faqs[5].answer, /hello@example.com/)
})
