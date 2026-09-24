import test from 'node:test'
import assert from 'node:assert/strict'

process.env.DATABASE_URL ||= 'postgres://test:test@localhost:5432/hongus_test'
const { renderEmail } = await import('../src/services/email.service.js')

test('plantillas generan HTML y texto, escapando nombres', () => {
  for (const kind of ['confirm', 'reset', 'welcome']) {
    const email = renderEmail(kind, '<Ana>', 'https://example.com/validar?token=abc&next=1')
    assert.match(email.subject, /Hongus/)
    assert.match(email.html, /&lt;Ana&gt;/)
    assert.doesNotMatch(email.html, /<Ana>/)
    assert.match(email.text, /https:\/\/example.com/)
  }
})
