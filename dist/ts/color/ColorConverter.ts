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
    [3.2404541621141054, -1.5371385940306088, -0.4985314095560162],
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

/**
 * Bradford cone response matrix and its inverse
 */
const BRADFORD = [
    [0.8951, 0.2664, -0.1614],
    [-0.7502, 1.7135, 0.0367],
    [0.0389, -0.0685, 1.0296]
];

const BRADFORD_INV = [
    [0.9869929, -0.1470543, 0.1599627],
    [0.4323053, 0.5183603, 0.0492912],
    [-0.0085287, 0.0400428, 0.9684867]
];

/**
 * Adapt XYZ between two white points using the Bradford transform
 */
function adaptXyz(xyz: XYZ, from: XYZ, to: XYZ): XYZ {
    const coneFrom = applyMatrix(BRADFORD, from);
    const coneTo = applyMatrix(BRADFORD, to);
    const cone = applyMatrix(BRADFORD, xyz);
    return applyMatrix(BRADFORD_INV, [
        cone[0] * coneTo[0] / coneFrom[0],
        cone[1] * coneTo[1] / coneFrom[1],
        cone[2] * coneTo[2] / coneFrom[2]
    ]);
}

const WHITE_D65: XYZ = [D65.X, D65.Y, D65.Z];
// ACES white point (x 0.32168, y 0.33767)
const WHITE_D60: XYZ = [0.32168 / 0.33767, 1, (1 - 0.32168 - 0.33767) / 0.33767];

/**
 * Apply a transfer function to every channel, preserving sign so that
 * out-of-gamut (negative) values survive the round trip.
 */
function encodeChannels(rgb: RGB, encode: (c: number) => number): RGB {
    const signed = (c: number) => Math.sign(c) * encode(Math.abs(c));
    return [signed(rgb[0]), signed(rgb[1]), signed(rgb[2])];
}

// ============================================================================
// XYZ → wide-gamut RGB spaces
// Matrices from CSS Color Module Level 4
// ============================================================================

const XYZ_TO_LINEAR_P3 = [
    [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
    [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
    [0.03584583024378447, -0.07617238926804182, 0.9568845240076872]
];

const XYZ_TO_LINEAR_A98 = [
    [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
    [-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
    [0.013444280632031142, -0.11836239223101838, 1.0151749943912054]
];

const XYZ_TO_LINEAR_REC2020 = [
    [1.7166511879712674, -0.35567078377639233, -0.25336628137365974],
    [-0.6666843518324892, 1.6164812366349395, 0.01576854581391113],
    [0.017639857445310783, -0.042770613257808524, 0.9421031212354738]
];

// ProPhoto RGB is defined relative to D50
const XYZ_D50_TO_LINEAR_PROPHOTO = [
    [1.3457868816471583, -0.25557208737979464, -0.05110186497554526],
    [-0.5446307051249019, 1.5082477428451468, 0.02052744743642139],
    [0, 0, 1.2119675456389452]
];

// ACEScg (AP1 primaries) is defined relative to the ACES white point
const XYZ_D60_TO_ACESCG = [
    [1.6410233796943257, -0.32480329418479, -0.23642469523761225],
    [-0.6636628587229829, 1.6153315916573379, 0.016756347685530137],
    [0.011721894328375376, -0.008284441996237409, 0.9883948585390215]
];

const REC2020_ALPHA = 1.09929682680944;
const REC2020_BETA = 0.018053968510807;

/** XYZ (D65) to linear-light sRGB (0-1, unclamped) */
export function xyzToLinearSrgb(xyz: XYZ): RGB {
    return applyMatrix(XYZ_TO_SRGB, xyz);
}

/** XYZ (D65) to linear-light Display P3 */
export function xyzToLinearP3(xyz: XYZ): RGB {
    return applyMatrix(XYZ_TO_LINEAR_P3, xyz);
}

/** XYZ (D65) to gamma-encoded Display P3 (sRGB transfer curve) */
export function xyzToP3(xyz: XYZ): RGB {
    return encodeChannels(xyzToLinearP3(xyz), linearToGamma);
}

/** XYZ (D65) to linear-light Adobe RGB (1998) */
export function xyzToLinearA98(xyz: XYZ): RGB {
    return applyMatrix(XYZ_TO_LINEAR_A98, xyz);
}

/** XYZ (D65) to gamma-encoded Adobe RGB (1998) */
export function xyzToA98(xyz: XYZ): RGB {
    return encodeChannels(xyzToLinearA98(xyz), (c) => Math.pow(c, 256 / 563));
}

/** XYZ (D65) to linear-light Rec. 2020 */
export function xyzToLinearRec2020(xyz: XYZ): RGB {
    return applyMatrix(XYZ_TO_LINEAR_REC2020, xyz);
}

/** XYZ (D65) to gamma-encoded Rec. 2020 */
export function xyzToRec2020(xyz: XYZ): RGB {
    return encodeChannels(xyzToLinearRec2020(xyz), (c) =>
        c < REC2020_BETA
            ? 4.5 * c
            : REC2020_ALPHA * Math.pow(c, 0.45) - (REC2020_ALPHA - 1)
    );
}

/** XYZ (D50) to linear-light ProPhoto RGB */
export function xyzD50ToLinearProphoto(xyz: XYZ): RGB {
    return applyMatrix(XYZ_D50_TO_LINEAR_PROPHOTO, xyz);
}

/** XYZ (D50) to gamma-encoded ProPhoto RGB */
export function xyzD50ToProphoto(xyz: XYZ): RGB {
    return encodeChannels(xyzD50ToLinearProphoto(xyz), (c) =>
        c >= 1 / 512 ? Math.pow(c, 1 / 1.8) : 16 * c
    );
}

/** XYZ (D65) to ACEScg (linear, AP1 primaries) */
export function xyzToAcescg(xyz: XYZ): RGB {
    return applyMatrix(XYZ_D60_TO_ACESCG, adaptXyz(xyz, WHITE_D65, WHITE_D60));
}

/** XYZ (D65) to Lab relative to the D65 white point */
export function xyzToLabD65(x: number, y: number, z: number): Lab {
    const fx = xyzToLabHelper(x / D65.X);
    const fy = xyzToLabHelper(y / D65.Y);
    const fz = xyzToLabHelper(z / D65.Z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// ============================================================================
// XYZ → OKLab / OKLCH
// ============================================================================

const XYZ_TO_OKLAB_LMS = [
    [0.8190224379967030, 0.3619062600528904, -0.1288737815209879],
    [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
    [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
];

const OKLAB_LMS_TO_OKLAB = [
    [0.2104542683093140, 0.7936177747023054, -0.0040720430116193],
    [1.9779985324311684, -2.4285922420485799, 0.4505937096174110],
    [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
];

/** XYZ (D65) to OKLab [L 0-1, a, b] */
export function xyzToOklab(xyz: XYZ): Lab {
    const lms = applyMatrix(XYZ_TO_OKLAB_LMS, xyz);
    return applyMatrix(OKLAB_LMS_TO_OKLAB, [
        Math.cbrt(lms[0]),
        Math.cbrt(lms[1]),
        Math.cbrt(lms[2])
    ]);
}

/** XYZ (D65) to OKLCH [L 0-1, C, H 0-360] */
export function xyzToOklch(xyz: XYZ): LCH {
    const [l, a, b] = xyzToOklab(xyz);
    return labToLch(l, a, b);
}

// ============================================================================
// HDR spaces: absolute XYZ, Jzazbz, ICtCp, Rec. 2100
// SDR reference white is mapped to 203 cd/m² (ITU-R BT.2408)
// ============================================================================

const SDR_WHITE_LUMINANCE = 203;

const PQ_M1 = 2610 / 16384;
const PQ_M2 = 2523 / 32;
const PQ_C1 = 3424 / 4096;
const PQ_C2 = 2413 / 128;
const PQ_C3 = 2392 / 128;

/** SMPTE ST 2084 (PQ) encoding of a luminance normalised to 10 000 cd/m² */
function pqEncode(value: number, m2: number = PQ_M2): number {
    const x = Math.pow(Math.max(value, 0), PQ_M1);
    return Math.pow((PQ_C1 + PQ_C2 * x) / (1 + PQ_C3 * x), m2);
}

/** XYZ (D65, relative) to absolute XYZ in cd/m² */
export function xyzToAbsolute(xyz: XYZ): XYZ {
    return [
        Math.max(xyz[0] * SDR_WHITE_LUMINANCE, 0),
        Math.max(xyz[1] * SDR_WHITE_LUMINANCE, 0),
        Math.max(xyz[2] * SDR_WHITE_LUMINANCE, 0)
    ];
}

const JZ_B = 1.15;
const JZ_G = 0.66;
const JZ_P = 1.7 * 2523 / 32;
const JZ_D = -0.56;
const JZ_D0 = 1.6295499532821565e-11;

const JZ_XYZ_TO_CONE = [
    [0.41478972, 0.579999, 0.0146480],
    [-0.2015100, 1.120649, 0.0531008],
    [-0.0166008, 0.264800, 0.6684799]
];

const JZ_CONE_TO_IAB = [
    [0.5, 0.5, 0],
    [3.524000, -4.066708, 0.542708],
    [0.199076, 1.096799, -1.295875]
];

/** XYZ (D65, relative) to Jzazbz */
export function xyzToJzazbz(xyz: XYZ): Lab {
    const [xa, ya, za] = xyzToAbsolute(xyz);
    const xm = JZ_B * xa - (JZ_B - 1) * za;
    const ym = JZ_G * ya - (JZ_G - 1) * xa;
    const lms = applyMatrix(JZ_XYZ_TO_CONE, [xm, ym, za]);
    const pq = lms.map((v) => pqEncode(v / 10000, JZ_P)) as XYZ;
    const [iz, az, bz] = applyMatrix(JZ_CONE_TO_IAB, pq);
    const jz = ((1 + JZ_D) * iz) / (1 + JZ_D * iz) - JZ_D0;
    return [jz, az, bz];
}

/** XYZ (D65, relative) to JzCzHz, the polar form of Jzazbz */
export function xyzToJzczhz(xyz: XYZ): LCH {
    const [jz, az, bz] = xyzToJzazbz(xyz);
    return labToLch(jz, az, bz);
}

const ICTCP_XYZ_TO_LMS = [
    [0.3592832590121217, 0.6976051147779502, -0.0358915932320290],
    [-0.1920808463704993, 1.1004767970374321, 0.0753748658519118],
    [0.0070797844607479, 0.0748396662186362, 0.8433265453898765]
];

const ICTCP_LMS_TO_ICTCP = [
    [2048 / 4096, 2048 / 4096, 0],
    [6610 / 4096, -13613 / 4096, 7003 / 4096],
    [17933 / 4096, -17390 / 4096, -543 / 4096]
];

/** XYZ (D65, relative) to ICtCp (PQ variant) */
export function xyzToIctcp(xyz: XYZ): XYZ {
    const lms = applyMatrix(ICTCP_XYZ_TO_LMS, xyzToAbsolute(xyz));
    const pq = lms.map((v) => pqEncode(v / 10000)) as XYZ;
    return applyMatrix(ICTCP_LMS_TO_ICTCP, pq);
}

/** XYZ (D65, relative) to Rec. 2100 with the PQ transfer function */
export function xyzToRec2100Pq(xyz: XYZ): RGB {
    const linear = xyzToLinearRec2020(xyz);
    return linear.map((c) =>
        pqEncode((c * SDR_WHITE_LUMINANCE) / 10000)
    ) as RGB;
}

const HLG_A = 0.17883277;
const HLG_B = 1 - 4 * HLG_A;
const HLG_C = 0.5 - HLG_A * Math.log(4 * HLG_A);
// Scales SDR white so it lands at 75% HLG signal (ITU-R BT.2408)
const HLG_SCALE = 3.7743;

/** XYZ (D65, relative) to Rec. 2100 with the HLG transfer function */
export function xyzToRec2100Hlg(xyz: XYZ): RGB {
    const linear = xyzToLinearRec2020(xyz);
    return linear.map((c) => {
        const e = Math.max(c, 0) / HLG_SCALE;
        return e <= 1 / 12
            ? Math.sqrt(3 * e)
            : HLG_A * Math.log(12 * e - HLG_B) + HLG_C;
    }) as RGB;
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
 * Convert hex string (#rgb or #rrggbb) to RGB (0-1 range)
 */
export function hexToRgb(hex: string): RGB {
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    const result = short
        ? [short[0], short[1] + short[1], short[2] + short[2], short[3] + short[3]]
        : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
 * Color spaces supported by `Color.to()`
 */
export type ColorSpace =
    | "srgb" | "srgb-linear"
    | "hsl" | "hsv" | "hwb"
    | "lch" | "lab" | "lab-d65"
    | "oklab" | "oklch"
    | "xyz" | "xyz-d65" | "xyz-d50" | "xyz-abs-d65"
    | "p3" | "p3-linear"
    | "a98rgb" | "a98rgb-linear"
    | "prophoto" | "prophoto-linear"
    | "rec2020" | "rec2020-linear"
    | "rec2100pq" | "rec2100hlg"
    | "acescg"
    | "jzazbz" | "jzczhz"
    | "ictcp";

/**
 * Hue of an RGB colour in degrees (0 for achromatic colours)
 */
function rgbHue(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    if (d === 0) return 0;
    let h: number;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return h * 60;
}

/**
 * Convert sRGB (0-1) to HSV where H: 0-360, S: 0-100, V: 0-100
 */
export function srgbToHsv(r: number, g: number, b: number): HSL {
    const max = Math.max(r, g, b);
    const s = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
    return [rgbHue(r, g, b), s * 100, max * 100];
}

/**
 * Convert sRGB (0-1) to HWB where H: 0-360, W: 0-100, B: 0-100
 */
export function srgbToHwb(r: number, g: number, b: number): HSL {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return [rgbHue(r, g, b), min * 100, (1 - max) * 100];
}

/**
 * A simple Color class that provides similar API to colorjs.io
 * but uses our native implementations
 */
export class Color {
    private readonly _l: number;
    private readonly _c: number;
    private readonly _h: number;
    private _xyzD50: XYZ | null = null;
    private _xyzD65: XYZ | null = null;
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

    private get xyzD50(): XYZ {
        if (!this._xyzD50) {
            const lab = lchToLab(this._l, this._c, this._h);
            this._xyzD50 = labToXyz(lab[0], lab[1], lab[2]);
        }
        return this._xyzD50;
    }

    private get xyzD65(): XYZ {
        if (!this._xyzD65) {
            this._xyzD65 = xyzD50ToD65(this.xyzD50);
        }
        return this._xyzD65;
    }

    private get rgb(): RGB {
        if (!this._rgb) {
            const xyz = this.xyzD65;
            this._rgb = xyzToSrgb(xyz[0], xyz[1], xyz[2]);
        }
        return this._rgb;
    }

    /**
     * Unclamped sRGB coordinates (0-1 for in-gamut colours)
     */
    get coords(): RGB {
        return [...this.rgb] as RGB;
    }

    /**
     * Convert to a different color space
     * Returns an object with coords property
     */
    to(colorSpace: ColorSpace): { coords: number[] } {
        return { coords: this.convert(colorSpace) };
    }

    private convert(colorSpace: ColorSpace): number[] {
        const rgb = this.rgb;
        const clamped = rgb.map((c) => clamp(c, 0, 1)) as RGB;

        switch (colorSpace) {
            case "srgb": return [...rgb];
            case "srgb-linear": return xyzToLinearSrgb(this.xyzD65);
            case "hsl": return srgbToHsl(...clamped);
            case "hsv": return srgbToHsv(...clamped);
            case "hwb": return srgbToHwb(...clamped);
            case "lch": return [this._l, this._c, this._h];
            case "lab": return lchToLab(this._l, this._c, this._h);
            case "lab-d65": return xyzToLabD65(...this.xyzD65);
            case "oklab": return xyzToOklab(this.xyzD65);
            case "oklch": return xyzToOklch(this.xyzD65);
            case "xyz":
            case "xyz-d65": return [...this.xyzD65];
            case "xyz-d50": return [...this.xyzD50];
            case "xyz-abs-d65": return xyzToAbsolute(this.xyzD65);
            case "p3": return xyzToP3(this.xyzD65);
            case "p3-linear": return xyzToLinearP3(this.xyzD65);
            case "a98rgb": return xyzToA98(this.xyzD65);
            case "a98rgb-linear": return xyzToLinearA98(this.xyzD65);
            case "prophoto": return xyzD50ToProphoto(this.xyzD50);
            case "prophoto-linear": return xyzD50ToLinearProphoto(this.xyzD50);
            case "rec2020": return xyzToRec2020(this.xyzD65);
            case "rec2020-linear": return xyzToLinearRec2020(this.xyzD65);
            case "rec2100pq": return xyzToRec2100Pq(this.xyzD65);
            case "rec2100hlg": return xyzToRec2100Hlg(this.xyzD65);
            case "acescg": return xyzToAcescg(this.xyzD65);
            case "jzazbz": return xyzToJzazbz(this.xyzD65);
            case "jzczhz": return xyzToJzczhz(this.xyzD65);
            case "ictcp": return xyzToIctcp(this.xyzD65);
            default:
                throw new Error(`Unsupported color space: ${String(colorSpace)}`);
        }
    }

    /**
     * Check if the color is within the sRGB gamut
     */
    inGamut(): boolean {
        const rgb = this.rgb;
        return isInGamut(rgb[0], rgb[1], rgb[2]);
    }
}

export default Color;
