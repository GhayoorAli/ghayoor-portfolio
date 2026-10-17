'use client'

import { useEffect, useRef, useState } from 'react'
import { saveFAQs } from '@/app/admin/actions'
import type { FAQItem } from '@/types/content'

export function FAQAdminForm({ initialFAQs }: { initialFAQs: FAQItem[] }) {
  const nextKey = useRef(initialFAQs.length)
  const [items, setItems] = useState(() => initialFAQs.map((item, index) => ({ ...item, key: `faq-${index}` })))
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (focusKey) document.getElementById(`${focusKey}-question`)?.focus()
  }, [focusKey])

  const changed = () => { setDirty(true); setMessage(''); setError('') }
  const add = () => {
    const key = `faq-${nextKey.current++}`
    setItems(current => [...current, { key, question: '', answer: '' }])
    setFocusKey(key)
    changed()
  }
  const move = (index: number, direction: -1 | 1) => {
    setItems(current => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    changed()
  }
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true); setMessage(''); setError('')
    try {
      await saveFAQs(items.map(({ question, answer }) => ({ question, answer })))
      setDirty(false)
      setMessage('FAQs saved. Your portfolio now shows the updated questions and answers.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save FAQs. Please try again.')
    } finally { setSaving(false) }
  }

  return (
    <form className="admin-page" onSubmit={event => void save(event)}>
      <header className="admin-page-header">
        <div>
          <h1>FAQ</h1>
          <p className="admin-lead">Manage the questions and answers shown on your portfolio.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn" type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>
      {message && <p className="admin-msg" role="status">{message}</p>}
      {error && <p className="admin-msg error" role="alert">{error}</p>}
      <fieldset className="admin-faq-fields" disabled={saving}>
        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <h2>Questions & answers</h2>
              <p className="admin-section-sub">Use the arrows to set the order. Save changes to publish your edits.</p>
            </div>
            <button className="admin-btn secondary admin-btn-sm" type="button" onClick={add}>+ Add question</button>
          </div>
          {!items.length && <p className="admin-lead">No questions yet. Add a question to get started. Saving an empty list hides the FAQ section.</p>}
          <div className="admin-stack">
            {items.map((item, index) => (
              <div className="admin-subcard" key={item.key}>
                <div className="admin-card-toolbar">
                  <strong>Question {index + 1}</strong>
                  <div className="admin-toolbar-aside">
                    <button type="button" className="admin-icon-btn" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
                    <button type="button" className="admin-icon-btn" aria-label={`Move question ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button>
                    <button type="button" className="admin-icon-btn danger" aria-label={`Remove question ${index + 1}`} onClick={() => { setItems(current => current.filter(row => row.key !== item.key)); changed() }}>×</button>
                  </div>
                </div>
                <div className="admin-field">
                  <label htmlFor={`${item.key}-question`}>Question</label>
                  <input id={`${item.key}-question`} required value={item.question} placeholder="What would you like visitors to know?" onChange={event => { setItems(current => current.map(row => row.key === item.key ? { ...row, question: event.target.value } : row)); changed() }} />
                </div>
                <div className="admin-field">
                  <label htmlFor={`${item.key}-answer`}>Answer</label>
                  <textarea id={`${item.key}-answer`} required rows={5} value={item.answer} placeholder="Write your answer…" onChange={event => { setItems(current => current.map(row => row.key === item.key ? { ...row, answer: event.target.value } : row)); changed() }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </fieldset>
      <div className="admin-actions">
        <button className="admin-btn secondary" type="button" disabled={saving} onClick={add}>+ Add question</button>
        <button className="admin-btn" type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save changes'}</button>
        {dirty && <span className="admin-section-sub">Unsaved changes</span>}
      </div>
    </form>
  )
}
