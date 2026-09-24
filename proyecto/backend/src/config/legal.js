import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const documents = JSON.parse(
  readFileSync(new URL('../../../shared/legal-documents.json', import.meta.url), 'utf8'),
)
if (documents.status !== 'current')
  throw new Error('Los documentos legales deben estar publicados antes de aceptar registros')
const digest = (document) => createHash('sha256').update(JSON.stringify(document)).digest('hex')

export const legalEvidence = {
  status: documents.status,
  termsVersion: documents.terms.version,
  termsHash: digest(documents.terms),
  privacyVersion: documents.privacy.version,
  privacyHash: digest(documents.privacy),
}
