// Import necessary functions and classes
import fs from 'fs/promises';
import { convertRGBtoHex, pad } from './util.js';

// ============================================================================
// Native LCH to sRGB conversion (replacing colorjs.io)
// ============================================================================

/**
 * Convert LCH to Lab
 */
function lchToLab(l, c, h) {
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    return [l, a, b];
}

/**
 * Helper function for Lab to XYZ conversion
 */
function labToXyzHelper(t) {
    const delta = 6 / 29;
    if (t > delta) {
        return t * t * t;
    }
    return 3 * delta * delta * (t - 4 / 29);
}

// D50 white point
const D50 = { X: 0.96422, Y: 1.0, Z: 0.82521 };

/**
 * Convert Lab to XYZ (D50)
 */
function labToXyz(l, a, b) {
    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    return [
        D50.X * labToXyzHelper(fx),
        D50.Y * labToXyzHelper(fy),
        D50.Z * labToXyzHelper(fz)
    ];
}

// Bradford D50 to D65 matrix
const D50_TO_D65 = [
    [0.9555766, -0.0230393, 0.0631636],
    [-0.0282895, 1.0099416, 0.0210077],
    [0.0122982, -0.0204830, 1.3299098]
];

/**
 * Convert XYZ D50 to D65
 */
function xyzD50ToD65(xyz) {
    return [
        D50_TO_D65[0][0] * xyz[0] + D50_TO_D65[0][1] * xyz[1] + D50_TO_D65[0][2] * xyz[2],
        D50_TO_D65[1][0] * xyz[0] + D50_TO_D65[1][1] * xyz[1] + D50_TO_D65[1][2] * xyz[2],
        D50_TO_D65[2][0] * xyz[0] + D50_TO_D65[2][1] * xyz[1] + D50_TO_D65[2][2] * xyz[2]
    ];
}

/**
 * sRGB linear to gamma
 */
function linearToGamma(c) {
    if (c <= 0.0031308) {
        return 12.92 * c;
    }
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// XYZ to sRGB matrix
const XYZ_TO_SRGB = [
    [3.2404541621141054, -1.5371385940306089, -0.4985314095560162],
    [-0.9692660305051868, 1.8760108454466942, 0.041556017530349834],
    [0.05564343095911475, -0.20397695888897652, 1.0572251882231791]
];

/**
 * Convert XYZ D65 to sRGB
 */
function xyzToSrgb(x, y, z) {
    const rLinear = XYZ_TO_SRGB[0][0] * x + XYZ_TO_SRGB[0][1] * y + XYZ_TO_SRGB[0][2] * z;
    const gLinear = XYZ_TO_SRGB[1][0] * x + XYZ_TO_SRGB[1][1] * y + XYZ_TO_SRGB[1][2] * z;
    const bLinear = XYZ_TO_SRGB[2][0] * x + XYZ_TO_SRGB[2][1] * y + XYZ_TO_SRGB[2][2] * z;

    return [linearToGamma(rLinear), linearToGamma(gLinear), linearToGamma(bLinear)];
}

/**
 * Convert LCH to sRGB (0-1 range)
 */
function lchToSrgb(l, c, h) {
    const lab = lchToLab(l, c, h);
    const xyzD50 = labToXyz(lab[0], lab[1], lab[2]);
    const xyzD65 = xyzD50ToD65(xyzD50);
    return xyzToSrgb(xyzD65[0], xyzD65[1], xyzD65[2]);
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


// ColorSwatch Class
class ColorSwatch {
    constructor(h, c, l, name) {
        if (h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
        this.name = name;
    }

    getRGB() {
        const rgb = lchToSrgb(this.l, this.c, this.h);
        return [
            Math.round(clamp(rgb[0], 0, 1) * 255),
            Math.round(clamp(rgb[1], 0, 1) * 255),
            Math.round(clamp(rgb[2], 0, 1) * 255)
        ];
    }

    toString() {
        const [r, g, b] = this.getRGB();
        return `rgb(${r}, ${g}, ${b})`;
    }

    hex() {
        const rgb = lchToSrgb(this.l, this.c, this.h);
        let hex = convertRGBtoHex(
            Math.round(clamp(rgb[0], 0, 1) * 255),
            Math.round(clamp(rgb[1], 0, 1) * 255),
            Math.round(clamp(rgb[2], 0, 1) * 255),
        );
        return hex;
    }
}

// ColorScheme Class
class ColorScheme {
    constructor(config, names) {
        this.config = config;
        this.names = names;
        this.colorList = [];
        this.colorDict = {};
        this.initializeColors();
    }

    initializeColors() {
        const l_count = Math.ceil(this.config.p_count / 2);
        const d_count = Math.floor(this.config.p_count / 2);
        const l_list = [];
        const c_list = [];

        for (let i = 0; i < this.config.p_count; i++) {
            let l_cur = this.config.l_l_min + i * this.config.l_l_step;
            l_list.push(l_cur);
        }

        for (let i = 0; i < l_count; i++) {
            let c_cur = this.config.l_c_min + i * this.config.l_c_step;
            c_list.push(c_cur);
        }

        for (let i = 0; i < d_count; i++) {
            let c_cur = this.config.l_c_min + i * this.config.d_c_step;
            c_list.push(c_cur);
        }

        for (let h = 0; h <= 360; h += this.config.h_step) {
            let h_group = {};
            let h_group_name = this.names[h] || h.toString();

            for (let i = 0; i < this.config.p_count; i++) {
                let l_cur = l_list[i];
                let c_cur = c_list[i];
                let name = this.config.prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
                let color = new ColorSwatch(h, c_cur, l_cur, name);
                this.colorList.push(color);
                h_group[name] = color;
            }

            this.colordict[h_group_name] = h_group;
        }
    }

    getColorList() {
        return this.colorList;
    }

    getColorDict() {
        return this.colorDict;
    }
}

// Configuration and usage
const hueConfig = {
    prefix: "N",
    h_step: 15,
    p_count: 9,
    l_l_min: 96,
    l_l_step: -6,
    d_l_step: -6,
    l_c_min: 12,
    l_c_step: 6,
    d_c_step: -6,
};

const hueNames = {
    0: "Grey",
    15: "Salmon",
    30: "Orange",
    45: "Amber",
    60: "Yellow",        // Fixed
    75: "Lime",
    90: "Ecru",
    105: "Olive",
    120: "Green",         // Fixed
    135: "Forest",
    150: "Jade",
    165: "Mint",
    180: "Cyan",          // Fixed
    195: "Teal",
    210: "Capri",
    225: "Sky",
    240: "Blue",          // Fixed
    255: "Azure",
    270: "Indigo",
    285: "Violet",
    300: "Magenta",       // Fixed
    315: "Purple",
    330: "Rose",
    345: "Pink",
    360: "Red"            // Fixed
};

// const colorScheme = new ColorScheme(hueConfig, hueNames);
// const colorDict = colorScheme.getColorDict();



// Assuming 'colorScheme' and 'ColorScheme' are already defined and set up
const colorScheme = new ColorScheme(hueConfig, hueNames);
const colorDict = colorScheme.getColorDict();

// Convert the colorDict object to a JSON string
const jsonContent = JSON.stringify(colorDict, null, 4); // Beautify the JSON output

// Define the path and filename for the output JSON file
const filePath = '../json/colorDict.json';

// Write the JSON string to a file
fs.writeFile(filePath, jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});
