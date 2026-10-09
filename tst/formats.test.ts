// ============================================================================
// Format Template Tests
// ============================================================================

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import * as lib from '../src/ts';
import { buildContext, CONSTANTS, createEnvironment, cssRgbPercent, FORMATS, paletteJson } from '../src/js/formats.js';


const ROOT = resolve(__dirname, '..');
const context = buildContext(lib, '0.1.1');
const env = createEnvironment();

/** Color name → value pairs, so formatting changes do not matter */
function entries(text: string): Record<string, string> {
    const pairs = text.matchAll(/^\s*\$?(N\d{4})\s*[:=]\s*['"]?(\w+\([^)]*\)|#[0-9a-fA-F]{3,8})/gm);
    return Object.fromEntries([...pairs].map(([, name, value]) => [name, value.trim()]));
}


describe('format templates', () => {

    it.each(Object.entries(FORMATS))('should render %s', (template) => {
        const output = env.render(template, context);
        expect(output).toContain('N0001');
        expect(output).toContain('N3609');
    });

    it('should produce a valid Sketch palette with every color', () => {
        const palette = JSON.parse(env.render('hue.gl.sketchpalette.jinja', context));
        expect(palette.colors).toHaveLength(225);
        expect(palette.colors[0]).toEqual({ name: 'N0001', red: 0.8863, green: 0.8863, blue: 0.8863, alpha: 1 });
    });

    it('should produce a GIMP/Inkscape palette with one line per color', () => {
        const lines = env.render('hue.gl.inkscape.jinja', context).trim().split('\n');
        expect(lines[0]).toBe('GIMP Palette');
        expect(lines.filter((line) => /^\d+ \d+ \d+\tN\d{4}/.test(line))).toHaveLength(225);
    });

    it('should define LaTeX colors with integer RGB values', () => {
        expect(env.render('hue.gl.tex.jinja', context)).toContain('\\definecolor{N2405}{RGB}{54,150,193}');
    });

    it('should export JSON grouped by hue', () => {
        const json = JSON.parse(paletteJson(context));
        expect(Object.keys(json)).toHaveLength(25);
        expect(json.Blue.N2405).toEqual({ hex: '#3696c1', rgb: { r: 54, g: 150, b: 193 }, hcl: { h: 240, c: 36, l: 58 } });
    });

    it.each(Object.entries(CONSTANTS))('should reproduce the committed constants from %s', (template, file) => {
        const committed = readFileSync(resolve(ROOT, file), 'utf8');
        expect(Object.keys(entries(committed))).toHaveLength(225);
        // Byte for byte, with the version written into the committed header
        const version = committed.split('\n')[3].replace('// ', '');
        expect(env.render(template, buildContext(lib, version))).toBe(committed);
    });

    it('should format sRGB like colorjs.io with 4 significant digits', () => {
        expect(cssRgbPercent([0.887_6, 0.49, 1])).toBe('rgb(88.76% 49% 100%)');
        expect(cssRgbPercent([0.051_234, 0.000_4, 0.999_99])).toBe('rgb(5.123% 0.04% 100%)');
    });

});
