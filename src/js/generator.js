// ============================================================================
// hue.gl format generator
// ----------------------------------------------------------------------------
// Writes the palette in the downloadable formats (LESS, Stylus, Python,
// LaTeX, Sketch, Inkscape/GIMP, Markdown, JSON) to dist/formats. Colors come
// from the built library, so every format matches the published constants.
//
// Usage: npm run generate [-- <output directory>]
// ============================================================================

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as lib from '../../dist/js/index.mjs'
import { buildContext, createEnvironment, FORMATS, paletteJson } from './formats.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const outputDir = resolve(process.argv[2] ?? resolve(root, 'dist/formats'))

const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const context = buildContext(lib, version)
const env = createEnvironment()

await mkdir(outputDir, { recursive: true })

for (const [template, file] of Object.entries(FORMATS)) {
    await writeFile(resolve(outputDir, file), env.render(template, context), 'utf8')
}
await writeFile(resolve(outputDir, 'hue.gl.json'), paletteJson(context), 'utf8')

// eslint-disable-next-line no-console -- CLI status output
console.log(
    `Wrote ${Object.keys(FORMATS).length + 1} formats (${context.swatches.length} colors) to ${outputDir}`,
)
