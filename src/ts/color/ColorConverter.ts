// ============================================================================
// ColorConverter.ts
// Native TypeScript implementation for color space conversions
// Replaces colorjs.io dependency
// ============================================================================

/**
 * Color coordinate types
 */
export type RGB = [number, number, number];
export type LCH = [number, number, number]; // [L, C, H] where L: 0-100, C: 0-150+, H: 0-360
export type Lab = [number, number, number]; // [L, a, b]
export type XYZ = [number, number, number];
export type HSL = [number, number, number]; // [H, S, L] where H: 0-360, S: 0-100, L: 0-100

/**
 * D65 white point reference values
 */
const D65 = {
    X: 0.95047,
    Y: 1.0,
    Z: 1.08883
};

/**
 * D50 white point reference values
 */
const D50 = {
    X: 0.96422,
    Y: 1.0,
    Z: 0.82521
};

// ============================================================================
// LCH ↔ Lab conversions
// ============================================================================

/**
 * Convert LCH to Lab
 * LCH is the cylindrical representation of Lab
 */
export function lchToLab(l: number, c: number, h: number): Lab {
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    return [l, a, b];
}

/**
 * Convert Lab to LCH
 */
export function labToLch(l: number, a: number, b: number): LCH {
    const c = Math.sqrt(a * a + b * b);
    let h = (Math.atan2(b, a) * 180) / Math.PI;
    if (h < 0) h += 360;
    return [l, c, h];
}

// ============================================================================
// Lab ↔ XYZ conversions
// ============================================================================

/**
 * Helper function for Lab to XYZ conversion
 */
function labToXyzHelper(t: number): number {
    const delta = 6 / 29;
    if (t > delta) {
        return t * t * t;
    }
    return 3 * delta * delta * (t - 4 / 29);
}

/**
 * Helper function for XYZ to Lab conversion
 */
function xyzToLabHelper(t: number): number {
    const delta = 6 / 29;
    if (t > delta * delta * delta) {
        return Math.cbrt(t);
    }
    return t / (3 * delta * delta) + 4 / 29;
}

/**
 * Convert Lab to XYZ (D50 white point, which is standard for Lab)
 */
export function labToXyz(l: number, a: number, b: number): XYZ {
    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const x = D50.X * labToXyzHelper(fx);
    const y = D50.Y * labToXyzHelper(fy);
    const z = D50.Z * labToXyzHelper(fz);

    return [x, y, z];
}

/**
 * Convert XYZ to Lab (D50 white point)
 */
export function xyzToLab(x: number, y: number, z: number): Lab {
    const fx = xyzToLabHelper(x / D50.X);
    const fy = xyzToLabHelper(y / D50.Y);
    const fz = xyzToLabHelper(z / D50.Z);

    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b = 200 * (fy - fz);

    return [l, a, b];
}

// ============================================================================
// XYZ ↔ sRGB conversions
// ============================================================================

/**
 * Bradford chromatic adaptation matrix from D50 to D65
 */
const D50_TO_D65 = [
    [0.9555766, -0.0230393, 0.0631636],
    [-0.0282895, 1.0099416, 0.0210077],
    [0.0122982, -0.0204830, 1.3299098]
];

/**
 * Apply matrix transformation
 */
function applyMatrix(matrix: number[][], xyz: XYZ): XYZ {
    return [
        matrix[0][0] * xyz[0] + matrix[0][1] * xyz[1] + matrix[0][2] * xyz[2],
        matrix[1][0] * xyz[0] + matrix[1][1] * xyz[1] + matrix[1][2] * xyz[2],
        matrix[2][0] * xyz[0] + matrix[2][1] * xyz[1] + matrix[2][2] * xyz[2]
    ];
}

/**
 * Convert XYZ (D50) to XYZ (D65) using Bradford adaptation
 */
export function xyzD50ToD65(xyz: XYZ): XYZ {
    return applyMatrix(D50_TO_D65, xyz);
}

/**
 * sRGB linear to gamma-corrected conversion
 */
function linearToGamma(c: number): number {
    if (c <= 0.0031308) {
        return 12.92 * c;
    }
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * sRGB gamma-corrected to linear conversion
 */
function gammaToLinear(c: number): number {
    if (c <= 0.04045) {
        return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * XYZ (D65) to linear sRGB matrix
 */
const XYZ_TO_SRGB = [
    [3.2404541621141054, -1.5371385940306089, -0.4985314095560162],
    [-0.9692660305051868, 1.8760108454466942, 0.041556017530349834],
    [0.05564343095911475, -0.20397695888897652, 1.0572251882231791]
];

/**
 * Convert XYZ (D65) to sRGB
 * Returns values in 0-1 range
 */
export function xyzToSrgb(x: number, y: number, z: number): RGB {
    // Apply XYZ to linear sRGB matrix
    const rLinear = XYZ_TO_SRGB[0][0] * x + XYZ_TO_SRGB[0][1] * y + XYZ_TO_SRGB[0][2] * z;
    const gLinear = XYZ_TO_SRGB[1][0] * x + XYZ_TO_SRGB[1][1] * y + XYZ_TO_SRGB[1][2] * z;
    const bLinear = XYZ_TO_SRGB[2][0] * x + XYZ_TO_SRGB[2][1] * y + XYZ_TO_SRGB[2][2] * z;

    // Apply gamma correction
    const r = linearToGamma(rLinear);
    const g = linearToGamma(gLinear);
    const b = linearToGamma(bLinear);

    return [r, g, b];
}

/**
 * sRGB to XYZ (D65) matrix
 */
const SRGB_TO_XYZ = [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
];

/**
 * Convert sRGB to XYZ (D65)
 * Input values should be in 0-1 range
 */
export function srgbToXyz(r: number, g: number, b: number): XYZ {
    // Apply inverse gamma correction
    const rLinear = gammaToLinear(r);
    const gLinear = gammaToLinear(g);
    const bLinear = gammaToLinear(b);

    // Apply linear sRGB to XYZ matrix
    const x = SRGB_TO_XYZ[0][0] * rLinear + SRGB_TO_XYZ[0][1] * gLinear + SRGB_TO_XYZ[0][2] * bLinear;
    const y = SRGB_TO_XYZ[1][0] * rLinear + SRGB_TO_XYZ[1][1] * gLinear + SRGB_TO_XYZ[1][2] * bLinear;
    const z = SRGB_TO_XYZ[2][0] * rLinear + SRGB_TO_XYZ[2][1] * gLinear + SRGB_TO_XYZ[2][2] * bLinear;

    return [x, y, z];
}

// ============================================================================
// Main conversion: LCH → sRGB
// ============================================================================

/**
 * Convert LCH to sRGB
 * This is the primary conversion used in the color palette generation
 *
 * @param l Lightness (0-100)
 * @param c Chroma (0-150+)
 * @param h Hue (0-360)
 * @returns RGB values in 0-1 range
 */
export function lchToSrgb(l: number, c: number, h: number): RGB {
    // LCH → Lab
    const [labL, labA, labB] = lchToLab(l, c, h);

    // Lab (D50) → XYZ (D50)
    const xyzD50 = labToXyz(labL, labA, labB);

    // XYZ (D50) → XYZ (D65)
    const xyzD65 = xyzD50ToD65(xyzD50);

    // XYZ (D65) → sRGB
    return xyzToSrgb(xyzD65[0], xyzD65[1], xyzD65[2]);
}

/**
 * Convert LCH to sRGB with values clamped to 0-255 range
 */
export function lchToSrgb255(l: number, c: number, h: number): RGB {
    const [r, g, b] = lchToSrgb(l, c, h);
    return [
        Math.round(clamp(r, 0, 1) * 255),
        Math.round(clamp(g, 0, 1) * 255),
        Math.round(clamp(b, 0, 1) * 255)
    ];
}

// ============================================================================
// HSL conversions
// ============================================================================

/**
 * Convert sRGB to HSL
 * Input: RGB values in 0-1 range
 * Output: HSL where H: 0-360, S: 0-100, L: 0-100
 */
export function srgbToHsl(r: number, g: number, b: number): HSL {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
        return [0, 0, l * 100];
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h: number;
    switch (max) {
        case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
        case g:
            h = ((b - r) / d + 2) / 6;
            break;
        default:
            h = ((r - g) / d + 4) / 6;
    }

    return [h * 360, s * 100, l * 100];
}

/**
 * Convert HSL to sRGB
 * Input: HSL where H: 0-360, S: 0-100, L: 0-100
 * Output: RGB values in 0-1 range
 */
export function hslToSrgb(h: number, s: number, l: number): RGB {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    if (s === 0) {
        return [l, l, l];
    }

    const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return [
        hue2rgb(p, q, h + 1/3),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1/3)
    ];
}

// ============================================================================
// Utility functions
// ============================================================================

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Check if RGB values are within the sRGB gamut (0-1 range)
 */
export function isInGamut(r: number, g: number, b: number, tolerance: number = 0.0001): boolean {
    return (
        r >= -tolerance && r <= 1 + tolerance &&
        g >= -tolerance && g <= 1 + tolerance &&
        b >= -tolerance && b <= 1 + tolerance
    );
}

/**
 * Convert RGB values (0-1) to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number): string => {
        const hex = Math.round(clamp(c, 0, 1) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert hex string to RGB (0-1 range)
 */
export function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ];
}

// ============================================================================
// Color class for compatibility with colorjs.io API
// ============================================================================

/**
 * A simple Color class that provides similar API to colorjs.io
 * but uses our native implementations
 */
export class Color {
    private _l: number;
    private _c: number;
    private _h: number;
    private _rgb: RGB | null = null;

    /**
     * Create a color from LCH values
     * @param colorSpace Must be "lch"
     * @param coords [L, C, H] values
     */
    constructor(colorSpace: string, coords: [number, number, number]) {
        if (colorSpace !== "lch") {
            throw new Error(`Unsupported color space: ${colorSpace}. Only "lch" is supported.`);
        }
        this._l = coords[0];
        this._c = coords[1];
        this._h = coords[2];
    }

    /**
     * Get the color coordinates
     */
    get coords(): RGB {
        if (!this._rgb) {
            this._rgb = lchToSrgb(this._l, this._c, this._h);
        }
        return this._rgb;
    }

    /**
     * Convert to a different color space
     * Returns an object with coords property
     */
    to(colorSpace: string): { coords: number[] } {
        const rgb = this.coords;

        switch (colorSpace) {
            case "srgb":
                return { coords: rgb };

            case "srgb-linear": {
                return {
                    coords: [
                        gammaToLinear(clamp(rgb[0], 0, 1)),
                        gammaToLinear(clamp(rgb[1], 0, 1)),
                        gammaToLinear(clamp(rgb[2], 0, 1))
                    ]
                };
            }

            case "hsl": {
                const hsl = srgbToHsl(
                    clamp(rgb[0], 0, 1),
                    clamp(rgb[1], 0, 1),
                    clamp(rgb[2], 0, 1)
                );
                return { coords: hsl };
            }

            case "lch":
                return { coords: [this._l, this._c, this._h] };

            case "lab": {
                const lab = lchToLab(this._l, this._c, this._h);
                return { coords: lab };
            }

            case "xyz":
            case "xyz-d65": {
                const lab = lchToLab(this._l, this._c, this._h);
                const xyzD50 = labToXyz(lab[0], lab[1], lab[2]);
                const xyzD65 = xyzD50ToD65(xyzD50);
                return { coords: xyzD65 };
            }

            case "xyz-d50": {
                const lab = lchToLab(this._l, this._c, this._h);
                return { coords: labToXyz(lab[0], lab[1], lab[2]) };
            }

            default:
                // For unsupported color spaces, return sRGB as fallback
                console.warn(`Color space "${colorSpace}" not fully supported, returning sRGB`);
                return { coords: rgb };
        }
    }

    /**
     * Check if the color is within the sRGB gamut
     */
    inGamut(): boolean {
        const rgb = this.coords;
        return isInGamut(rgb[0], rgb[1], rgb[2]);
    }
}

export default Color;
