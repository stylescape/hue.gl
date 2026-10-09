// ============================================================================
// hue.gl constants generator
// ----------------------------------------------------------------------------
// Writes the palette constants (src/scss/hue/*, src/ts/constants/hue_*.ts)
// from the src/jinja templates, with colors from the built library and the
// version from package.json. tst/formats.test.ts checks that the committed
// files match this output.
//
// Usage: npm run generate:constants
// ============================================================================

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as lib from '../../dist/js/index.mjs';
import { buildContext, CONSTANTS, createEnvironment } from './formats.js';


const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const context = buildContext(lib, version);
const env = createEnvironment();

for (const [template, file] of Object.entries(CONSTANTS)) {
    await writeFile(resolve(root, file), env.render(template, context), 'utf8');
}

// eslint-disable-next-line no-console -- CLI status output
console.log(`Wrote ${Object.keys(CONSTANTS).length} constant files (${context.swatches.length} colors, version ${version})`);
