// ============================================================================
// Utility Functions Tests
// ============================================================================

import { describe, expect, it } from 'vitest';
import { colorToHex, convertRGBtoHex, pad, rgb2cmyk } from '../src/ts/util';


describe('util functions', () => {

    describe('rgb2cmyk', () => {

        it('should convert pure red to CMYK', () => {
            const cmyk = rgb2cmyk(255, 0, 0, false);

            expect(cmyk.c).toBeCloseTo(0, 1);
            expect(cmyk.m).toBeCloseTo(100, 1);
            expect(cmyk.y).toBeCloseTo(100, 1);
            expect(cmyk.k).toBeCloseTo(0, 1);
        });

        it('should convert pure green to CMYK', () => {
            const cmyk = rgb2cmyk(0, 255, 0, false);

            expect(cmyk.c).toBeCloseTo(100, 1);
            expect(cmyk.m).toBeCloseTo(0, 1);
            expect(cmyk.y).toBeCloseTo(100, 1);
            expect(cmyk.k).toBeCloseTo(0, 1);
        });

        it('should convert pure blue to CMYK', () => {
            const cmyk = rgb2cmyk(0, 0, 255, false);

            expect(cmyk.c).toBeCloseTo(100, 1);
            expect(cmyk.m).toBeCloseTo(100, 1);
            expect(cmyk.y).toBeCloseTo(0, 1);
            expect(cmyk.k).toBeCloseTo(0, 1);
        });

        it('should convert black to CMYK', () => {
            const cmyk = rgb2cmyk(0, 0, 0, false);

            expect(cmyk.k).toBe(100);
        });

        it('should convert white to CMYK', () => {
            const cmyk = rgb2cmyk(255, 255, 255, false);

            expect(cmyk.c).toBe(0);
            expect(cmyk.m).toBe(0);
            expect(cmyk.y).toBe(0);
            expect(cmyk.k).toBe(0);
        });

        it('should return normalized values when requested', () => {
            const cmyk = rgb2cmyk(255, 0, 0, true);

            expect(cmyk.c).toBeGreaterThanOrEqual(0);
            expect(cmyk.c).toBeLessThanOrEqual(1);
        });

    });


    describe('colorToHex', () => {

        it('should convert 0 to "00"', () => {
            const hex = colorToHex(0);

            expect(hex).toBe('00');
        });

        it('should convert 255 to "ff"', () => {
            const hex = colorToHex(255);

            expect(hex).toBe('ff');
        });

        it('should convert 15 to "0f"', () => {
            const hex = colorToHex(15);

            expect(hex).toBe('0f');
        });

        it('should convert 128 to "80"', () => {
            const hex = colorToHex(128);

            expect(hex).toBe('80');
        });

    });


    describe('convertRGBtoHex', () => {

        it('should convert black to #000000', () => {
            const hex = convertRGBtoHex(0, 0, 0);

            expect(hex).toBe('#000000');
        });

        it('should convert white to #ffffff', () => {
            const hex = convertRGBtoHex(255, 255, 255);

            expect(hex).toBe('#ffffff');
        });

        it('should convert red to #ff0000', () => {
            const hex = convertRGBtoHex(255, 0, 0);

            expect(hex).toBe('#ff0000');
        });

        it('should convert green to #00ff00', () => {
            const hex = convertRGBtoHex(0, 255, 0);

            expect(hex).toBe('#00ff00');
        });

        it('should convert blue to #0000ff', () => {
            const hex = convertRGBtoHex(0, 0, 255);

            expect(hex).toBe('#0000ff');
        });

    });


    describe('pad', () => {

        it('should pad single digit to specified length', () => {
            const result = pad('5', 3, '0');

            expect(result).toBe('005');
        });

        it('should pad empty string', () => {
            const result = pad('', 4, 'x');

            expect(result).toBe('xxxx');
        });

        it('should not pad if already at length', () => {
            const result = pad('123', 3, '0');

            expect(result).toBe('123');
        });

        it('should not pad if longer than specified', () => {
            const result = pad('12345', 3, '0');

            expect(result).toBe('12345');
        });

        it('should work with arrays (length property)', () => {
            // Arrays are converted to string first, then padded
            // [1, 2].toString() = "1,2" (length 3), pad to 4 = "01,2"
            const result = pad([1, 2], 4, '0');

            expect(result).toBe('01,2');
        });

    });

});
