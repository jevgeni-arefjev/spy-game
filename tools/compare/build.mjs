#!/usr/bin/env node
/*
 * Builds the direction-comparison page.
 *
 * Discovers every `vN/` directory at the repo root, inlines each mockup's
 * `index.html` and `DIRECTION.md` into the template as JSON, and writes a
 * single self-contained page.
 *
 *   node tools/compare/build.mjs [--out <file>]
 *
 * Re-run it whenever a version changes or a new one is added; nothing here
 * knows how many versions there are.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..', '..')

const args = process.argv.slice(2)
const outIndex = args.indexOf('--out')
const outFile = outIndex === -1
  ? join(here, 'dist', 'index.html')
  : resolve(process.cwd(), args[outIndex + 1])

const versionDirs = readdirSync(repoRoot, { withFileTypes: true })
  // `v6` and its variants `v6-1`, `v6-2`, … all count as versions.
  .filter(entry => entry.isDirectory() && /^v\d+(-\d+)?$/.test(entry.name))
  .map(entry => entry.name)
  .sort((a, b) => {
    const [aMajor, aMinor = 0] = a.slice(1).split('-').map(Number)
    const [bMajor, bMinor = 0] = b.slice(1).split('-').map(Number)
    return aMajor - bMajor || aMinor - bMinor
  })

if (versionDirs.length === 0) {
  console.error('No vN/ directories found in ' + repoRoot)
  process.exit(1)
}

/** `# v2 - Box Lid` -> `Box Lid`. */
function titleOf (markdown, id) {
  const line = markdown.split('\n').find(l => l.startsWith('# '))
  if (!line) return id
  return line.replace(/^#\s*/, '').replace(new RegExp('^' + id + '\\s*[-–—]\\s*'), '').trim()
}

/** The Thesis section's first sentence, used as the caption under a frame. */
function thesisOf (markdown) {
  const section = markdown.split(/^##\s+Thesis\s*$/m)[1]
  if (!section) return ''
  const body = section.split(/^##\s/m)[0]
  const first = body.split('\n').map(l => l.trim()).find(Boolean)
  return first || ''
}

const versions = versionDirs.map(id => {
  const dir = join(repoRoot, id)
  const html = readFileSync(join(dir, 'index.html'), 'utf8')
  const directionPath = join(dir, 'DIRECTION.md')
  const direction = existsSync(directionPath) ? readFileSync(directionPath, 'utf8') : ''
  return { id, name: titleOf(direction, id), thesis: thesisOf(direction), direction, html }
})

const template = readFileSync(join(here, 'template.html'), 'utf8')
const payload = JSON.stringify(versions).replace(/</g, '\\u003c')
// A function replacement, so `$$` and `$&` inside a version's own JS are not
// treated as replacement patterns.
const page = template.replace('/*__VERSIONS__*/null', () => payload)

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, page)

const kb = (Buffer.byteLength(page) / 1024).toFixed(0)
console.log(`Wrote ${outFile} (${kb} KB) from ${versions.map(v => v.id).join(', ')}`)
