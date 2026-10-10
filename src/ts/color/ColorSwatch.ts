// ============================================================================
// Import
// ============================================================================

import {
    Color,
    type ColorSpace,
    isInGamut,
    lchToSrgb,
    lchToSrgb255,
    rgbToHex,
} from './ColorConverter'

// ============================================================================
// Functions
// ============================================================================

function assertValidHCL(h: number, c: number, l: number): void {
    const finite = Number.isFinite(h) && Number.isFinite(c) && Number.isFinite(l)
    if (!finite || h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
        throw new Error('Invalid HCL values')
    }
}

// ============================================================================
// Classes
// ============================================================================

export class ColorSwatch {
    public name?: string
    public h: number = 0 // Hue (0-360)
    public c: number = 0 // Chroma (0-150+)
    public l: number = 0 // Luminance (0-100)

    constructor(h: number, c: number, l: number, name?: string) {
        assertValidHCL(h, c, l)
        this.h = h
        this.c = c
        this.l = l
        this.name = name
    }

    /**
     * Colour model for the current HCL values; rebuilt on access so it never
     * goes stale after `setHCL` or a direct property update.
     */
    get model(): Color {
        return new Color('lch', [this.l, this.c, this.h])
    }

    setHCL(h: number, c: number, l: number): void {
        assertValidHCL(h, c, l)
        this.h = h
        this.c = c
        this.l = l
    }

    /// Color Gamut Checks
    checkGamut(): boolean {
        const rgb = lchToSrgb(this.l, this.c, this.h)
        return isInGamut(rgb[0], rgb[1], rgb[2])
    }

    getName(): string | undefined {
        return this.name
    }

    getRGB(): [number, number, number] {
        return lchToSrgb255(this.l, this.c, this.h)
    }

    /**
     * Coordinates of this colour in any supported colour space
     */
    to(colorSpace: ColorSpace): number[] {
        return this.model.to(colorSpace).coords
    }

    // Color Space Conversions
    // ========================================================================

    a98rgb() {
        return this.to('a98rgb')
    }
    a98rgb_linear() {
        return this.to('a98rgb-linear')
    }
    acescg() {
        return this.to('acescg')
    }
    hsl() {
        return this.to('hsl')
    }
    hsv() {
        return this.to('hsv')
    }
    hwb() {
        return this.to('hwb')
    }
    ictcp() {
        return this.to('ictcp')
    }
    jzczhz() {
        return this.to('jzczhz')
    }
    jzazbz() {
        return this.to('jzazbz')
    }
    lab() {
        return this.to('lab')
    }
    lab_d65() {
        return this.to('lab-d65')
    }
    lch() {
        return this.to('lch')
    }
    oklch() {
        return this.to('oklch')
    }
    oklab() {
        return this.to('oklab')
    }
    p3() {
        return this.to('p3')
    }
    p3_linear() {
        return this.to('p3-linear')
    }
    prophoto() {
        return this.to('prophoto')
    }
    prophoto_linear() {
        return this.to('prophoto-linear')
    }
    rec2020() {
        return this.to('rec2020')
    }
    rec2020_linear() {
        return this.to('rec2020-linear')
    }
    rec2100hlg() {
        return this.to('rec2100hlg')
    }
    rec2100pq() {
        return this.to('rec2100pq')
    }
    xyz_abs_d65() {
        return this.to('xyz-abs-d65')
    }
    xyz_d50() {
        return this.to('xyz-d50')
    }
    xyz_d65() {
        return this.to('xyz-d65')
    }
    xyz() {
        return this.to('xyz')
    }
    srgb() {
        return this.to('srgb')
    }
    srgb_linear() {
        return this.to('srgb-linear')
    }

    hex() {
        const rgb = lchToSrgb(this.l, this.c, this.h)
        return rgbToHex(rgb[0], rgb[1], rgb[2])
    }

    hcl() {
        return {
            h: this.h,
            c: this.c,
            l: this.l,
        }
    }

    rgb() {
        const [r, g, b] = this.getRGB()
        return {
            r: r,
            g: g,
            b: b,
        }
    }

    toString(): string {
        const [r, g, b] = this.getRGB()
        return `rgb(${r}, ${g}, ${b})`
    }

    toDict(): Record<string, string | number | undefined> {
        return {
            name: this.name,
            hcl_h: this.h,
            hcl_c: this.c,
            hcl_l: this.l,
        }
    }
}

// ============================================================================
// Export
// ============================================================================

export default ColorSwatch
