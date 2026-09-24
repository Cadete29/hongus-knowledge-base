import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { pool } from './config/db.js'

const directory = fileURLToPath(new URL('../migrations/', import.meta.url))
try {
  for (const name of (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort()) {
    await pool.query(await readFile(new URL(`../migrations/${name}`, import.meta.url), 'utf8'))
    console.log(`Migración aplicada: ${name}`)
  }
} finally {
  await pool.end()
}
