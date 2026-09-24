import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { legalEvidence } from '../src/config/legal.js'

test('los documentos aceptados tienen una copia versionada e íntegra', () => {
  const current = JSON.parse(
    readFileSync(new URL('../../shared/legal-documents.json', import.meta.url), 'utf8'),
  )
  const archive = JSON.parse(
    readFileSync(
      new URL(`../../shared/archive/${current.updatedAt}.json`, import.meta.url),
      'utf8',
    ),
  )
  assert.deepEqual(current, archive)
  assert.equal(current.status, 'current')
  assert.equal(legalEvidence.termsVersion, current.terms.version)
  assert.equal(legalEvidence.privacyVersion, current.privacy.version)
  assert.equal(
    legalEvidence.termsHash,
    createHash('sha256').update(JSON.stringify(current.terms)).digest('hex'),
  )
  assert.equal(
    legalEvidence.privacyHash,
    createHash('sha256').update(JSON.stringify(current.privacy)).digest('hex'),
  )
})
