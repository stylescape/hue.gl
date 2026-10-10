// ============================================================================
// hue.gl format rendering
// ----------------------------------------------------------------------------
// Shared by the generator (against the built library) and the tests (against
// the TypeScript sources). Templates live in src/jinja and are rendered with
// Nunjucks, which reads the same syntax as Jinja.
// ============================================================================

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import nunjucks from 'nunjucks'

const TEMPLATE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../jinja')

// Template → output file
export const FORMATS = {
    'hue.gl.less.jinja': 'hue.gl.less',
    'hue.gl.styl.jinja': 'hue.gl.styl',
    'hue.gl.py.jinja': 'hue_gl.py',
    'hue.gl.tex.jinja': 'hue.gl.tex',
    'hue.gl.sketchpalette.jinja': 'hue.gl.sketchpalette',
    'hue.gl.inkscape.jinja': 'hue.gl.gpl',
    'hue.gl.md.jinja': 'hue.gl.md',
}

// Template → generated constants (relative to the repository root), written
// by `npm run generate:constants`
export const CONSTANTS = {
    'hue.gl-hex-var.scss.jinja': 'src/scss/hue/_hue.gl-hex-var.scss',
    'hue.gl-hex-map.scss.jinja': 'src/scss/hue/_hue.gl-hex-map.scss',
    'hue.gl-rgb-var.scss.jinja': 'src/scss/hue/_hue.gl-rgb-var.scss',
    'hue.gl-rgb-map.scss.jinja': 'src/scss/hue/_hue.gl-rgb-map.scss',
    'hue.gl-hcl-var.scss.jinja': 'src/scss/hue/_hue.gl-hcl-var.scss',
    'hue.gl-hcl-map.scss.jinja': 'src/scss/hue/_hue.gl-hcl-map.scss',
    'hue.gl-hex-enum.ts.jinja': 'src/ts/constants/hue_hex.ts',
    'hue.gl-rgb-enum.ts.jinja': 'src/ts/constants/hue_rgb.ts',
    'hue.gl-hcl-enum.ts.jinja': 'src/ts/constants/hue_hcl.ts',
}

/**
 * Round to significant digits, the way colorjs.io's `toString({ precision })`
 * does (the original generator for the rgb() constants used colorjs.io).
 */
function toPrecision(value, precision) {
    const integerLength = String(Math.floor(Math.abs(value))).length
    if (precision > integerLength) {
        return +value.toFixed(precision - integerLength)
    }
    const p10 = 10 ** (integerLength - precision)
    return Math.round(value / p10) * p10
}

/** CSS Color 4 `rgb(r% g% b%)` with 4 significant digits per channel */
export function cssRgbPercent([r, g, b], precision = 4) {
    const channel = (value) => `${toPrecision(value * 100, precision)}%`
    return `rgb(${channel(r)} ${channel(g)} ${channel(b)})`
}

/**
 * Template context for the palette.
 *
 * @param lib - The hue.gl library (built bundle or TypeScript sources).
 * @param version - Version string written into the file headers.
 */
export function buildContext(lib, version) {
    const scheme = new lib.ColorScheme(lib.hueConfig, lib.hueNames)
    const colors = {}
    const swatches = []

    for (const [group, groupSwatches] of Object.entries(scheme.getColorDict())) {
        colors[group] = {}
        for (const [name, swatch] of Object.entries(groupSwatches)) {
            // The method names the templates were written against
            const hex = swatch.hex().toLowerCase()
            const color = {
                name,
                group,
                hex: () => hex,
                rgb: () => swatch.rgb(),
                // Unrounded sRGB from the library's own conversion
                srgb: () => cssRgbPercent(swatch.srgb()),
                hcl: () => swatch.hcl(),
                // From the published hex, so HSL matches ColorPicker.get('HSL', …)
                hsl: () => lib.srgbToHsl(...lib.hexToRgb(hex)),
            }
            colors[group][name] = color
            swatches.push(color)
        }
    }

    return { name: 'hue.gl', version, colors, swatches }
}

export function createEnvironment() {
    // trimBlocks/lstripBlocks match the Jinja settings the templates were written for
    return new nunjucks.Environment(new nunjucks.FileSystemLoader(TEMPLATE_DIR), {
        autoescape: false,
        throwOnUndefined: true,
        trimBlocks: true,
        lstripBlocks: true,
    })
}

/** JSON export: { group: { name: { hex, rgb, hcl } } } */
export function paletteJson(context) {
    const json = {}
    for (const [group, groupColors] of Object.entries(context.colors)) {
        json[group] = Object.fromEntries(
            Object.entries(groupColors).map(([name, color]) => [
                name,
                { hex: color.hex(), rgb: color.rgb(), hcl: color.hcl() },
            ]),
        )
    }
    return JSON.stringify(json, null, 4) + '\n'
}

/** CSV export: one row per color */
export function paletteCsv(context) {
    const rows = context.swatches.map((color) => {
        const { r, g, b } = color.rgb()
        const { h, c, l } = color.hcl()
        return [color.name, color.group, color.hex(), r, g, b, h, c, l].join(',')
    })
    return ['name,group,hex,r,g,b,h,c,l', ...rows].join('\n') + '\n'
}

/** SVG swatch sheet: one row per hue, one square per color */
export function paletteSvg(context, size = 24) {
    const groups = Object.entries(context.colors)
    const width = Math.max(...groups.map(([, group]) => Object.keys(group).length)) * size
    const rects = groups.flatMap(([group, groupColors], row) =>
        Object.entries(groupColors).map(
            ([name, color], column) =>
                `    <rect x="${column * size}" y="${row * size}" width="${size}" height="${size}" ` +
                `fill="${color.hex()}"><title>${name} ${group} ${color.hex()}</title></rect>`,
        ),
    )
    return (
        [
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${groups.length * size}" ` +
                `width="${width}" height="${groups.length * size}">`,
            `    <title>hue.gl ${context.version}</title>`,
            ...rects,
            '</svg>',
        ].join('\n') + '\n'
    )
}

/** Tailwind preset: `presets: [hue]` gives `bg-N2405`, `text-N2405`, ... */
export function tailwindPreset(context) {
    const colors = Object.fromEntries(context.swatches.map((color) => [color.name, color.hex()]))
    return (
        `// hue.gl ${context.version}: Tailwind preset\n` +
        `export default { theme: { extend: { colors: ${JSON.stringify(colors, null, 4)} } } };\n`
    )
}
