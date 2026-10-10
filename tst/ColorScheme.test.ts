// ============================================================================
// ColorScheme Tests
// ============================================================================

import { beforeEach, describe, expect, it } from 'vitest'
import { ColorScheme } from '../src/ts/color/ColorScheme'
import { hueConfig } from '../src/ts/config/hue.config'
import { hueNames } from '../src/ts/config/hue.names'
import { hue_hex, hue_rgb } from '../src/ts/constants'

describe('ColorScheme', () => {
    let scheme: ColorScheme

    beforeEach(() => {
        scheme = new ColorScheme(hueConfig, hueNames)
    })

    describe('constructor', () => {
        it('should create a ColorScheme with config and names', () => {
            expect(scheme.config).toEqual(hueConfig)
            expect(scheme.names).toBe(hueNames)
        })

        it('should initialize colorList array', () => {
            expect(Array.isArray(scheme.colorList)).toBe(true)
        })

        it('should initialize colorDict object', () => {
            expect(typeof scheme.colorDict).toBe('object')
        })
    })

    describe('color generation', () => {
        it('should generate the correct number of colors', () => {
            // 25 hues (0, 15, 30, ... 360) × 9 shades = 225 colors
            // Actually: 0 to 360 in steps of 15 = 25 hues
            const expectedHues = Math.floor(360 / hueConfig.h_step) + 1
            const expectedColors = expectedHues * hueConfig.p_count

            expect(scheme.colorList.length).toBe(expectedColors)
        })

        it('should populate colorDict with all hue groups', () => {
            const hueGroupCount = Object.keys(scheme.colorDict).length
            const expectedGroups = Math.floor(360 / hueConfig.h_step) + 1

            expect(hueGroupCount).toBe(expectedGroups)
        })

        it('should generate colors with correct naming pattern', () => {
            const firstColor = scheme.colorList[0]

            expect(firstColor.name).toMatch(/^N\d{3}\d$/)
        })
    })

    describe('getColorList', () => {
        it('should return the color list', () => {
            const list = scheme.getColorList()

            expect(list).toBe(scheme.colorList)
        })

        it('should return ColorSwatch instances', () => {
            const list = scheme.getColorList()

            list.forEach((color) => {
                expect(color).toHaveProperty('h')
                expect(color).toHaveProperty('c')
                expect(color).toHaveProperty('l')
                expect(color).toHaveProperty('name')
            })
        })
    })

    describe('getColorDict', () => {
        it('should return the color dictionary', () => {
            const dict = scheme.getColorDict()

            expect(dict).toBe(scheme.colorDict)
        })

        it('should contain named hue groups', () => {
            const dict = scheme.getColorDict()

            // Check for some expected hue names
            expect(dict).toHaveProperty('Grey')
            expect(dict).toHaveProperty('Red')
            expect(dict).toHaveProperty('Green')
            expect(dict).toHaveProperty('Blue')
        })

        it('should have correct number of colors per hue group', () => {
            const dict = scheme.getColorDict()

            Object.values(dict).forEach((hueGroup) => {
                expect(Object.keys(hueGroup).length).toBe(hueConfig.p_count)
            })
        })
    })

    describe('color values', () => {
        it('should generate grey colors with zero chroma', () => {
            const greyGroup = scheme.colorDict['Grey']

            Object.values(greyGroup).forEach((color) => {
                expect(color.c).toBe(0)
            })
        })

        it('should have valid HCL values for all colors', () => {
            scheme.colorList.forEach((color) => {
                expect(color.h).toBeGreaterThanOrEqual(0)
                expect(color.h).toBeLessThanOrEqual(360)
                expect(color.c).toBeGreaterThanOrEqual(0)
                expect(color.c).toBeLessThanOrEqual(100)
                expect(color.l).toBeGreaterThanOrEqual(0)
                expect(color.l).toBeLessThanOrEqual(100)
            })
        })
    })

    describe('custom config', () => {
        it('should respect custom p_count', () => {
            const customConfig = { ...hueConfig, p_count: 5 }
            const customScheme = new ColorScheme(customConfig, hueNames)

            const expectedHues = Math.floor(360 / customConfig.h_step) + 1
            const expectedColors = expectedHues * 5

            expect(customScheme.colorList.length).toBe(expectedColors)
        })

        it('should respect custom h_step', () => {
            const customConfig = { ...hueConfig, h_step: 30 }
            const customScheme = new ColorScheme(customConfig, hueNames)

            // 0, 30, 60, 90, ... 360 = 13 hues
            const expectedHues = Math.floor(360 / 30) + 1
            const expectedColors = expectedHues * customConfig.p_count

            expect(customScheme.colorList.length).toBe(expectedColors)
        })

        it('should fall back to the defaults for omitted options', () => {
            const customScheme = new ColorScheme({ p_count: 3 })

            expect(customScheme.config).toEqual({ ...hueConfig, p_count: 3 })
            expect(customScheme.getColorDict()).toHaveProperty('Blue')
        })

        it('should key unnamed hues by their angle', () => {
            const customScheme = new ColorScheme({ ...hueConfig, h_step: 20 }, hueNames)
            const groups = Object.keys(customScheme.getColorDict())

            expect(groups).not.toContain('undefined')
            expect(groups).toContain('20')
            expect(groups).toContain('Red')
        })

        it('should reject a configuration that cannot terminate', () => {
            expect(() => new ColorScheme({ ...hueConfig, h_step: 0 })).toThrow()
            expect(() => new ColorScheme({ ...hueConfig, p_count: 0 })).toThrow()
        })
    })

    describe('published palette', () => {
        it('should reproduce every published hex and rgb constant', () => {
            const scheme = new ColorScheme(hueConfig, hueNames)

            expect(scheme.colorList).toHaveLength(Object.keys(hue_hex).length)
            for (const swatch of scheme.colorList) {
                const key = swatch.name as keyof typeof hue_hex
                expect(swatch.hex().toLowerCase(), key).toBe(hue_hex[key])
                expect(swatch.toString(), key).toBe(hue_rgb[key as keyof typeof hue_rgb])
            }
        })
    })
})
