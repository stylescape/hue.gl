// ============================================================================
// SCSS Library Tests
// ============================================================================

import { resolve } from 'node:path';
import { compile, compileString } from 'sass';
import { describe, expect, it } from 'vitest';


const SCSS_DIR = resolve(__dirname, '../src/scss');

/**
 * Compiles a snippet against the public entry point and fails on any warning,
 * so deprecated built-ins and "color not found" fallbacks surface in tests.
 */
function render(body: string): string {
    const warnings: string[] = [];
    const result = compileString(`@use "index" as hue;\n${body}`, {
        loadPaths: [SCSS_DIR],
        logger: {
            warn: (message) => { warnings.push(message); },
        },
    });
    expect(warnings).toEqual([]);
    return result.css;
}

/** Value of a single declaration in the compiled output */
function value(expression: string): string {
    const css = render(`.probe { value: ${expression}; }`);
    const match = /value: (.*);/.exec(css);
    expect(match, css).not.toBeNull();
    return match![1];
}


describe('SCSS library', () => {

    it('should emit no CSS from the library entry point', () => {
        expect(render('').trim()).toBe('');
    });

    it('should resolve palette colors', () => {
        expect(value('hue.hue_color(N2405)')).toBe('#3696c1');
        expect(value('hue.$N2405')).toBe('#3696c1');
    });

    it.each([
        ['hue.hue_border_color(N2405)', /^rgba\(54, 150, 193, 0\.5\)$/],
        ['hue.hue_color_opacity(N2405, 0.25)', /^rgba\(54, 150, 193, 0\.25\)$/],
        ['hue.hue_gradient(N2405, N0605)', /^linear-gradient\(#3696c1, #b57f55\)$/],
        ['hue.hue_blend_colors(N0001, N0009)', /^#/],
        ['hue.hue_complementary(N2405)', /^#|^rgb/],
        ['hue.hue_shade(N2405)', /^rgb|^#/],
        ['hue.hue_tint(N2405)', /^rgb|^#/],
        ['hue.hue_striped_background(N2405, N0605)', /^repeating-linear-gradient\(45deg, #3696c1/],
        ['hue.hue_apply_filter(N2405, sepia)', /^rgb|^#/],
        ['hue.hue_to_grayscale(N2405)', /^rgb|^#/],
    ])('should compute %s', (expression, expected) => {
        expect(value(expression)).toMatch(expected);
    });

    it('should calculate WCAG contrast', () => {
        expect(value('hue.hue_contrast(white, black)')).toBe('21');
        expect(Number(value('hue.hue_contrast_ratio(N0009, N0001)'))).toBeCloseTo(8.26, 1);
        expect(value('hue.color_contrast(#fff)')).toBe('black');
        expect(value('hue.color_contrast(#000)')).toBe('white');
        expect(value('hue.hue_contrast_text_color(N2409)')).toBe('white');
    });

    it('should order a color scale from light to dark', () => {
        const scale = value('hue.hue_color_scale(N2405, 5)');
        const colors = scale.split(/,\s*(?![^()]*\))/);
        expect(colors).toHaveLength(5);
        expect(colors[2]).toBe('#3696c1');
    });

    it('should export the mixins', () => {
        const css = render(`
            .a { @include hue.accessible_text_color(N2409); }
            .b { @include hue.gradient_bg(N2405, N0605); }
            .c { @include hue.button_theme(N0001); }
        `);
        expect(css).toContain('color: white');
        expect(css).toContain('linear-gradient(#3696c1, #b57f55)');
        expect(css).toContain('color: black');
    });

    it('should build the CSS bundle with variables and utility classes', () => {
        const css = compile(resolve(SCSS_DIR, 'hue.gl.scss')).css;
        expect(css).toContain('--color-N2405: #3696c1;');
        expect(css).toMatch(/\.bg-N2405 \{\s+background-color: #3696c1;/);
        expect(css.match(/--color-N\d{4}:/g)).toHaveLength(225);
    });

});
