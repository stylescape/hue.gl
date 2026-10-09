// ============================================================================
// ColorConverter Tests
// ============================================================================

import { describe, expect, it } from 'vitest';
import {
    Color,
    hexToRgb,
    srgbToXyz,
    xyzD50ToProphoto,
    xyzToA98,
    xyzToAcescg,
    xyzToIctcp,
    xyzToJzazbz,
    xyzToLabD65,
    xyzToLinearRec2020,
    xyzToOklab,
    xyzToOklch,
    xyzToP3,
    xyzToRec2020,
    xyzToRec2100Hlg,
    xyzToRec2100Pq,
    type XYZ
} from '../src/ts/color/ColorConverter';
import { ColorPicker } from '../src/ts/color/ColorPicker';


function expectClose(actual: number[], expected: number[], digits = 3) {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i], digits));
}

const WHITE: XYZ = srgbToXyz(1, 1, 1);
const RED: XYZ = srgbToXyz(1, 0, 0);


describe('ColorConverter', () => {

    describe('hexToRgb', () => {

        it('should parse six-digit hex', () => {
            expectClose(hexToRgb('#ff8000'), [1, 128 / 255, 0]);
        });

        it('should parse three-digit shorthand', () => {
            expect(hexToRgb('#f80')).toEqual(hexToRgb('#ff8800'));
        });

        it('should reject malformed input', () => {
            expect(() => hexToRgb('#ff80')).toThrow('Invalid hex color');
        });

    });


    describe('wide-gamut RGB', () => {

        it('should map sRGB white to white in every RGB space', () => {
            expectClose(xyzToP3(WHITE), [1, 1, 1]);
            expectClose(xyzToA98(WHITE), [1, 1, 1]);
            expectClose(xyzToRec2020(WHITE), [1, 1, 1]);
            expectClose(xyzToAcescg(WHITE), [1, 1, 1]);
        });

        it('should place sRGB red inside the wider gamuts', () => {
            expectClose(xyzToP3(RED), [0.9175, 0.2003, 0.1386]);
            expectClose(xyzToA98(RED), [0.8587, 0, 0], 2);
            expectClose(xyzToLinearRec2020(RED), [0.6274, 0.0691, 0.0164]);
        });

        it('should convert D50 white to ProPhoto white', () => {
            const color = new Color('lch', [100, 0, 0]);
            expectClose(xyzD50ToProphoto(color.to('xyz-d50').coords as XYZ), [1, 1, 1]);
        });

    });


    describe('perceptual spaces', () => {

        it('should convert sRGB red to OKLab and OKLCH', () => {
            expectClose(xyzToOklab(RED), [0.62796, 0.22486, 0.12585]);
            expectClose(xyzToOklch(RED), [0.62796, 0.25768, 29.2339], 2);
        });

        it('should map white to L=100 in D65 Lab', () => {
            expectClose(xyzToLabD65(...WHITE), [100, 0, 0], 2);
        });

    });


    describe('HDR spaces', () => {

        it('should place SDR white at the reference levels', () => {
            expectClose(xyzToRec2100Pq(WHITE), [0.5807, 0.5807, 0.5807]);
            expectClose(xyzToRec2100Hlg(WHITE), [0.75, 0.75, 0.75]);
        });

        it('should keep white achromatic in ICtCp and Jzazbz', () => {
            const [i, ct, cp] = xyzToIctcp(WHITE);
            expect(i).toBeCloseTo(0.5807, 2);
            expect(Math.abs(ct)).toBeLessThan(0.005);
            expect(Math.abs(cp)).toBeLessThan(0.005);

            const [jz, az, bz] = xyzToJzazbz(WHITE);
            expect(jz).toBeCloseTo(0.222, 2);
            expect(Math.abs(az)).toBeLessThan(0.001);
            expect(Math.abs(bz)).toBeLessThan(0.001);
        });

    });


    describe('Color', () => {

        it('should not leak its cached coordinates', () => {
            const color = new Color('lch', [50, 30, 120]);
            const coords = color.to('srgb').coords;
            coords[0] = 99;

            expect(color.coords[0]).not.toBe(99);
            expect(color.to('srgb').coords[0]).not.toBe(99);
        });

        it('should reject unknown colour spaces', () => {
            const color = new Color('lch', [50, 30, 120]);
            // @ts-expect-error: deliberately unsupported
            expect(() => color.to('cmyk')).toThrow('Unsupported color space');
        });

    });

});


describe('ColorPicker', () => {

    it('should return the published values', () => {
        expect(ColorPicker.get('HEX', 'N0001')).toBe('#e2e2e2');
        expect(ColorPicker.get('RGB', 'N0001')).toBe('rgb(226, 226, 226)');
        expect(ColorPicker.get('HCL', 'N0001')).toBe('hcl(0, 0, 90)');
    });

    it('should derive HSL from the hex value', () => {
        expect(ColorPicker.get('HSL', 'N0001')).toBe('hsl(0, 0%, 88.6%)');
    });

    it('should return null for unknown keys, including inherited ones', () => {
        expect(ColorPicker.get('HEX', 'N9999')).toBeNull();
        expect(ColorPicker.get('HEX', 'constructor')).toBeNull();
        expect(ColorPicker.get('HSL', 'toString')).toBeNull();
    });

});
