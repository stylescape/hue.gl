// ============================================================================
// hue.gl format rendering
// ----------------------------------------------------------------------------
// Shared by the generator (against the built library) and the tests (against
// the TypeScript sources). Templates live in src/jinja and are rendered with
// Nunjucks, which reads the same syntax as Jinja.
// ============================================================================

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import nunjucks from 'nunjucks';


const TEMPLATE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../jinja');

// Template → output file
export const FORMATS = {
    'hue.gl.less.jinja': 'hue.gl.less',
    'hue.gl.styl.jinja': 'hue.gl.styl',
    'hue.gl.py.jinja': 'hue_gl.py',
    'hue.gl.tex.jinja': 'hue.gl.tex',
    'hue.gl.sketchpalette.jinja': 'hue.gl.sketchpalette',
    'hue.gl.inkscape.jinja': 'hue.gl.gpl',
    'hue.gl.md.jinja': 'hue.gl.md',
};


/**
 * Template context for the palette.
 *
 * @param lib - The hue.gl library (built bundle or TypeScript sources).
 * @param version - Version string written into the file headers.
 */
export function buildContext(lib, version) {
    const scheme = new lib.ColorScheme(lib.hueConfig, lib.hueNames);
    const colors = {};
    const swatches = [];

    for (const [group, groupSwatches] of Object.entries(scheme.getColorDict())) {
        colors[group] = {};
        for (const [name, swatch] of Object.entries(groupSwatches)) {
            // The method names the templates were written against
            const hex = swatch.hex().toLowerCase();
            const color = {
                name,
                group,
                hex: () => hex,
                rgb: () => swatch.rgb(),
                hcl: () => swatch.hcl(),
                // From the published hex, so HSL matches ColorPicker.get('HSL', …)
                hsl: () => lib.srgbToHsl(...lib.hexToRgb(hex)),
            };
            colors[group][name] = color;
            swatches.push(color);
        }
    }

    return { name: 'hue.gl', version, colors, swatches };
}


export function createEnvironment() {
    // trimBlocks/lstripBlocks match the Jinja settings the templates were written for
    return new nunjucks.Environment(
        new nunjucks.FileSystemLoader(TEMPLATE_DIR),
        { autoescape: false, throwOnUndefined: true, trimBlocks: true, lstripBlocks: true },
    );
}


/** JSON export: { group: { name: { hex, rgb, hcl } } } */
export function paletteJson(context) {
    const json = {};
    for (const [group, groupColors] of Object.entries(context.colors)) {
        json[group] = Object.fromEntries(Object.entries(groupColors).map(([name, color]) => [
            name, { hex: color.hex(), rgb: color.rgb(), hcl: color.hcl() },
        ]));
    }
    return JSON.stringify(json, null, 4) + '\n';
}
