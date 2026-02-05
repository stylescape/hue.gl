// ============================================================================
// ColorSwatch Tests
// ============================================================================

import { beforeEach, describe, expect, it } from 'vitest';
import { ColorSwatch } from '../src/ts/color/ColorSwatch';


describe('ColorSwatch', () => {

    describe('constructor', () => {

        it('should create a ColorSwatch with valid HCL values', () => {
            const swatch = new ColorSwatch(120, 50, 50, 'TestGreen');

            expect(swatch.h).toBe(120);
            expect(swatch.c).toBe(50);
            expect(swatch.l).toBe(50);
            expect(swatch.name).toBe('TestGreen');
        });

        it('should throw error for invalid hue value (negative)', () => {
            expect(() => new ColorSwatch(-10, 50, 50)).toThrow('Invalid HCL values');
        });

        it('should throw error for invalid hue value (>360)', () => {
            expect(() => new ColorSwatch(400, 50, 50)).toThrow('Invalid HCL values');
        });

        it('should throw error for invalid chroma value', () => {
            expect(() => new ColorSwatch(120, 150, 50)).toThrow('Invalid HCL values');
        });

        it('should throw error for invalid luminance value', () => {
            expect(() => new ColorSwatch(120, 50, 120)).toThrow('Invalid HCL values');
        });

        it('should create a ColorSwatch without a name', () => {
            const swatch = new ColorSwatch(180, 30, 70);

            expect(swatch.h).toBe(180);
            expect(swatch.name).toBeUndefined();
        });

    });


    describe('color space conversions', () => {

        let swatch: ColorSwatch;

        beforeEach(() => {
            swatch = new ColorSwatch(120, 50, 50, 'TestGreen');
        });

        it('should convert to RGB values', () => {
            const rgb = swatch.rgb();

            expect(rgb).toHaveProperty('r');
            expect(rgb).toHaveProperty('g');
            expect(rgb).toHaveProperty('b');
            expect(rgb.r).toBeGreaterThanOrEqual(0);
            expect(rgb.r).toBeLessThanOrEqual(255);
            expect(rgb.g).toBeGreaterThanOrEqual(0);
            expect(rgb.g).toBeLessThanOrEqual(255);
            expect(rgb.b).toBeGreaterThanOrEqual(0);
            expect(rgb.b).toBeLessThanOrEqual(255);
        });

        it('should convert to hex string', () => {
            const hex = swatch.hex();

            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should return HCL values', () => {
            const hcl = swatch.hcl();

            expect(hcl.h).toBe(120);
            expect(hcl.c).toBe(50);
            expect(hcl.l).toBe(50);
        });

        it('should convert to HSL', () => {
            const hsl = swatch.hsl();

            expect(hsl).toHaveLength(3);
        });

        it('should convert to LAB', () => {
            const lab = swatch.lab();

            expect(lab).toHaveLength(3);
        });

        it('should convert to OKLCH', () => {
            const oklch = swatch.oklch();

            expect(oklch).toHaveLength(3);
        });

        it('should convert to sRGB', () => {
            const srgb = swatch.srgb();

            expect(srgb).toBeDefined();
            expect(srgb.coords).toHaveLength(3);
        });

    });


    describe('utility methods', () => {

        it('should return name via getName()', () => {
            const swatch = new ColorSwatch(240, 40, 60, 'TestBlue');

            expect(swatch.getName()).toBe('TestBlue');
        });

        it('should return dictionary representation', () => {
            const swatch = new ColorSwatch(300, 45, 55, 'TestMagenta');
            const dict = swatch.toDict();

            expect(dict.name).toBe('TestMagenta');
            expect(dict.hcl_h).toBe(300);
            expect(dict.hcl_c).toBe(45);
            expect(dict.hcl_l).toBe(55);
        });

        it('should return RGB string representation', () => {
            const swatch = new ColorSwatch(60, 60, 80, 'TestYellow');
            const str = swatch.toString();

            expect(str).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
        });

    });


    describe('setHCL method', () => {

        it('should update HCL values', () => {
            const swatch = new ColorSwatch(0, 0, 50);
            swatch.setHCL(180, 40, 70);

            expect(swatch.h).toBe(180);
            expect(swatch.c).toBe(40);
            expect(swatch.l).toBe(70);
        });

        it('should throw error for invalid values', () => {
            const swatch = new ColorSwatch(0, 0, 50);

            expect(() => swatch.setHCL(-10, 50, 50)).toThrow('Invalid HCL values');
        });

    });


    describe('gamut checking', () => {

        it('should check if color is in gamut', () => {
            const swatch = new ColorSwatch(120, 30, 50);
            const inGamut = swatch.checkGamut(swatch.model);

            expect(typeof inGamut).toBe('boolean');
        });

    });


    describe('edge cases', () => {

        it('should handle grey (hue 0, chroma 0)', () => {
            const grey = new ColorSwatch(0, 0, 50, 'Grey');
            const rgb = grey.rgb();

            // Grey should have equal R, G, B values
            expect(rgb.r).toBeCloseTo(rgb.g, 0);
            expect(rgb.g).toBeCloseTo(rgb.b, 0);
        });

        it('should handle white (max luminance)', () => {
            const white = new ColorSwatch(0, 0, 100, 'White');
            const rgb = white.rgb();

            expect(rgb.r).toBeCloseTo(255, 0);
            expect(rgb.g).toBeCloseTo(255, 0);
            expect(rgb.b).toBeCloseTo(255, 0);
        });

        it('should handle black (min luminance)', () => {
            const black = new ColorSwatch(0, 0, 0, 'Black');
            const rgb = black.rgb();

            expect(rgb.r).toBeCloseTo(0, 0);
            expect(rgb.g).toBeCloseTo(0, 0);
            expect(rgb.b).toBeCloseTo(0, 0);
        });

    });

});
