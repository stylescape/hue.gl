// src/ts/color/ColorConverter.ts
var D50 = {
  X: 0.96422,
  Y: 1,
  Z: 0.82521
};
function lchToLab(l, c, h) {
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return [l, a, b];
}
function labToXyzHelper(t) {
  const delta = 6 / 29;
  if (t > delta) {
    return t * t * t;
  }
  return 3 * delta * delta * (t - 4 / 29);
}
function labToXyz(l, a, b) {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const x = D50.X * labToXyzHelper(fx);
  const y = D50.Y * labToXyzHelper(fy);
  const z = D50.Z * labToXyzHelper(fz);
  return [x, y, z];
}
var D50_TO_D65 = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.020483, 1.3299098]
];
function applyMatrix(matrix, xyz) {
  return [
    matrix[0][0] * xyz[0] + matrix[0][1] * xyz[1] + matrix[0][2] * xyz[2],
    matrix[1][0] * xyz[0] + matrix[1][1] * xyz[1] + matrix[1][2] * xyz[2],
    matrix[2][0] * xyz[0] + matrix[2][1] * xyz[1] + matrix[2][2] * xyz[2]
  ];
}
function xyzD50ToD65(xyz) {
  return applyMatrix(D50_TO_D65, xyz);
}
function linearToGamma(c) {
  if (c <= 31308e-7) {
    return 12.92 * c;
  }
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function gammaToLinear(c) {
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}
var XYZ_TO_SRGB = [
  [3.2404541621141054, -1.5371385940306088, -0.4985314095560162],
  [-0.9692660305051868, 1.8760108454466942, 0.041556017530349834],
  [0.05564343095911475, -0.20397695888897652, 1.0572251882231791]
];
function xyzToSrgb(x, y, z) {
  const rLinear = XYZ_TO_SRGB[0][0] * x + XYZ_TO_SRGB[0][1] * y + XYZ_TO_SRGB[0][2] * z;
  const gLinear = XYZ_TO_SRGB[1][0] * x + XYZ_TO_SRGB[1][1] * y + XYZ_TO_SRGB[1][2] * z;
  const bLinear = XYZ_TO_SRGB[2][0] * x + XYZ_TO_SRGB[2][1] * y + XYZ_TO_SRGB[2][2] * z;
  const r = linearToGamma(rLinear);
  const g = linearToGamma(gLinear);
  const b = linearToGamma(bLinear);
  return [r, g, b];
}
function lchToSrgb(l, c, h) {
  const [labL, labA, labB] = lchToLab(l, c, h);
  const xyzD50 = labToXyz(labL, labA, labB);
  const xyzD65 = xyzD50ToD65(xyzD50);
  return xyzToSrgb(xyzD65[0], xyzD65[1], xyzD65[2]);
}
function lchToSrgb255(l, c, h) {
  const [r, g, b] = lchToSrgb(l, c, h);
  return [
    Math.round(clamp(r, 0, 1) * 255),
    Math.round(clamp(g, 0, 1) * 255),
    Math.round(clamp(b, 0, 1) * 255)
  ];
}
function srgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return [0, 0, l * 100];
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
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
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function isInGamut(r, g, b, tolerance = 1e-4) {
  return r >= -tolerance && r <= 1 + tolerance && g >= -tolerance && g <= 1 + tolerance && b >= -tolerance && b <= 1 + tolerance;
}
function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.round(clamp(c, 0, 1) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
var Color = class {
  /**
   * Create a color from LCH values
   * @param colorSpace Must be "lch"
   * @param coords [L, C, H] values
   */
  constructor(colorSpace, coords) {
    this._rgb = null;
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
  get coords() {
    if (!this._rgb) {
      this._rgb = lchToSrgb(this._l, this._c, this._h);
    }
    return this._rgb;
  }
  /**
   * Convert to a different color space
   * Returns an object with coords property
   */
  to(colorSpace) {
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
        console.warn(`Color space "${colorSpace}" not fully supported, returning sRGB`);
        return { coords: rgb };
    }
  }
  /**
   * Check if the color is within the sRGB gamut
   */
  inGamut() {
    const rgb = this.coords;
    return isInGamut(rgb[0], rgb[1], rgb[2]);
  }
};

// src/ts/constants/hue_hcl.ts
var hue_hcl = /* @__PURE__ */ ((hue_hcl2) => {
  hue_hcl2["N0001"] = "hcl(0, 0, 90)";
  hue_hcl2["N0002"] = "hcl(0, 0, 82)";
  hue_hcl2["N0003"] = "hcl(0, 0, 74)";
  hue_hcl2["N0004"] = "hcl(0, 0, 66)";
  hue_hcl2["N0005"] = "hcl(0, 0, 58)";
  hue_hcl2["N0006"] = "hcl(0, 0, 50)";
  hue_hcl2["N0007"] = "hcl(0, 0, 42)";
  hue_hcl2["N0008"] = "hcl(0, 0, 34)";
  hue_hcl2["N0009"] = "hcl(0, 0, 26)";
  hue_hcl2["N0151"] = "hcl(15, 12, 90)";
  hue_hcl2["N0152"] = "hcl(15, 18, 82)";
  hue_hcl2["N0153"] = "hcl(15, 24, 74)";
  hue_hcl2["N0154"] = "hcl(15, 30, 66)";
  hue_hcl2["N0155"] = "hcl(15, 36, 58)";
  hue_hcl2["N0156"] = "hcl(15, 30, 50)";
  hue_hcl2["N0157"] = "hcl(15, 24, 42)";
  hue_hcl2["N0158"] = "hcl(15, 18, 34)";
  hue_hcl2["N0159"] = "hcl(15, 12, 26)";
  hue_hcl2["N0301"] = "hcl(30, 12, 90)";
  hue_hcl2["N0302"] = "hcl(30, 18, 82)";
  hue_hcl2["N0303"] = "hcl(30, 24, 74)";
  hue_hcl2["N0304"] = "hcl(30, 30, 66)";
  hue_hcl2["N0305"] = "hcl(30, 36, 58)";
  hue_hcl2["N0306"] = "hcl(30, 30, 50)";
  hue_hcl2["N0307"] = "hcl(30, 24, 42)";
  hue_hcl2["N0308"] = "hcl(30, 18, 34)";
  hue_hcl2["N0309"] = "hcl(30, 12, 26)";
  hue_hcl2["N0451"] = "hcl(45, 12, 90)";
  hue_hcl2["N0452"] = "hcl(45, 18, 82)";
  hue_hcl2["N0453"] = "hcl(45, 24, 74)";
  hue_hcl2["N0454"] = "hcl(45, 30, 66)";
  hue_hcl2["N0455"] = "hcl(45, 36, 58)";
  hue_hcl2["N0456"] = "hcl(45, 30, 50)";
  hue_hcl2["N0457"] = "hcl(45, 24, 42)";
  hue_hcl2["N0458"] = "hcl(45, 18, 34)";
  hue_hcl2["N0459"] = "hcl(45, 12, 26)";
  hue_hcl2["N0601"] = "hcl(60, 12, 90)";
  hue_hcl2["N0602"] = "hcl(60, 18, 82)";
  hue_hcl2["N0603"] = "hcl(60, 24, 74)";
  hue_hcl2["N0604"] = "hcl(60, 30, 66)";
  hue_hcl2["N0605"] = "hcl(60, 36, 58)";
  hue_hcl2["N0606"] = "hcl(60, 30, 50)";
  hue_hcl2["N0607"] = "hcl(60, 24, 42)";
  hue_hcl2["N0608"] = "hcl(60, 18, 34)";
  hue_hcl2["N0609"] = "hcl(60, 12, 26)";
  hue_hcl2["N0751"] = "hcl(75, 12, 90)";
  hue_hcl2["N0752"] = "hcl(75, 18, 82)";
  hue_hcl2["N0753"] = "hcl(75, 24, 74)";
  hue_hcl2["N0754"] = "hcl(75, 30, 66)";
  hue_hcl2["N0755"] = "hcl(75, 36, 58)";
  hue_hcl2["N0756"] = "hcl(75, 30, 50)";
  hue_hcl2["N0757"] = "hcl(75, 24, 42)";
  hue_hcl2["N0758"] = "hcl(75, 18, 34)";
  hue_hcl2["N0759"] = "hcl(75, 12, 26)";
  hue_hcl2["N0901"] = "hcl(90, 12, 90)";
  hue_hcl2["N0902"] = "hcl(90, 18, 82)";
  hue_hcl2["N0903"] = "hcl(90, 24, 74)";
  hue_hcl2["N0904"] = "hcl(90, 30, 66)";
  hue_hcl2["N0905"] = "hcl(90, 36, 58)";
  hue_hcl2["N0906"] = "hcl(90, 30, 50)";
  hue_hcl2["N0907"] = "hcl(90, 24, 42)";
  hue_hcl2["N0908"] = "hcl(90, 18, 34)";
  hue_hcl2["N0909"] = "hcl(90, 12, 26)";
  hue_hcl2["N1051"] = "hcl(105, 12, 90)";
  hue_hcl2["N1052"] = "hcl(105, 18, 82)";
  hue_hcl2["N1053"] = "hcl(105, 24, 74)";
  hue_hcl2["N1054"] = "hcl(105, 30, 66)";
  hue_hcl2["N1055"] = "hcl(105, 36, 58)";
  hue_hcl2["N1056"] = "hcl(105, 30, 50)";
  hue_hcl2["N1057"] = "hcl(105, 24, 42)";
  hue_hcl2["N1058"] = "hcl(105, 18, 34)";
  hue_hcl2["N1059"] = "hcl(105, 12, 26)";
  hue_hcl2["N1201"] = "hcl(120, 12, 90)";
  hue_hcl2["N1202"] = "hcl(120, 18, 82)";
  hue_hcl2["N1203"] = "hcl(120, 24, 74)";
  hue_hcl2["N1204"] = "hcl(120, 30, 66)";
  hue_hcl2["N1205"] = "hcl(120, 36, 58)";
  hue_hcl2["N1206"] = "hcl(120, 30, 50)";
  hue_hcl2["N1207"] = "hcl(120, 24, 42)";
  hue_hcl2["N1208"] = "hcl(120, 18, 34)";
  hue_hcl2["N1209"] = "hcl(120, 12, 26)";
  hue_hcl2["N1351"] = "hcl(135, 12, 90)";
  hue_hcl2["N1352"] = "hcl(135, 18, 82)";
  hue_hcl2["N1353"] = "hcl(135, 24, 74)";
  hue_hcl2["N1354"] = "hcl(135, 30, 66)";
  hue_hcl2["N1355"] = "hcl(135, 36, 58)";
  hue_hcl2["N1356"] = "hcl(135, 30, 50)";
  hue_hcl2["N1357"] = "hcl(135, 24, 42)";
  hue_hcl2["N1358"] = "hcl(135, 18, 34)";
  hue_hcl2["N1359"] = "hcl(135, 12, 26)";
  hue_hcl2["N1501"] = "hcl(150, 12, 90)";
  hue_hcl2["N1502"] = "hcl(150, 18, 82)";
  hue_hcl2["N1503"] = "hcl(150, 24, 74)";
  hue_hcl2["N1504"] = "hcl(150, 30, 66)";
  hue_hcl2["N1505"] = "hcl(150, 36, 58)";
  hue_hcl2["N1506"] = "hcl(150, 30, 50)";
  hue_hcl2["N1507"] = "hcl(150, 24, 42)";
  hue_hcl2["N1508"] = "hcl(150, 18, 34)";
  hue_hcl2["N1509"] = "hcl(150, 12, 26)";
  hue_hcl2["N1651"] = "hcl(165, 12, 90)";
  hue_hcl2["N1652"] = "hcl(165, 18, 82)";
  hue_hcl2["N1653"] = "hcl(165, 24, 74)";
  hue_hcl2["N1654"] = "hcl(165, 30, 66)";
  hue_hcl2["N1655"] = "hcl(165, 36, 58)";
  hue_hcl2["N1656"] = "hcl(165, 30, 50)";
  hue_hcl2["N1657"] = "hcl(165, 24, 42)";
  hue_hcl2["N1658"] = "hcl(165, 18, 34)";
  hue_hcl2["N1659"] = "hcl(165, 12, 26)";
  hue_hcl2["N1801"] = "hcl(180, 12, 90)";
  hue_hcl2["N1802"] = "hcl(180, 18, 82)";
  hue_hcl2["N1803"] = "hcl(180, 24, 74)";
  hue_hcl2["N1804"] = "hcl(180, 30, 66)";
  hue_hcl2["N1805"] = "hcl(180, 36, 58)";
  hue_hcl2["N1806"] = "hcl(180, 30, 50)";
  hue_hcl2["N1807"] = "hcl(180, 24, 42)";
  hue_hcl2["N1808"] = "hcl(180, 18, 34)";
  hue_hcl2["N1809"] = "hcl(180, 12, 26)";
  hue_hcl2["N1951"] = "hcl(195, 12, 90)";
  hue_hcl2["N1952"] = "hcl(195, 18, 82)";
  hue_hcl2["N1953"] = "hcl(195, 24, 74)";
  hue_hcl2["N1954"] = "hcl(195, 30, 66)";
  hue_hcl2["N1955"] = "hcl(195, 36, 58)";
  hue_hcl2["N1956"] = "hcl(195, 30, 50)";
  hue_hcl2["N1957"] = "hcl(195, 24, 42)";
  hue_hcl2["N1958"] = "hcl(195, 18, 34)";
  hue_hcl2["N1959"] = "hcl(195, 12, 26)";
  hue_hcl2["N2101"] = "hcl(210, 12, 90)";
  hue_hcl2["N2102"] = "hcl(210, 18, 82)";
  hue_hcl2["N2103"] = "hcl(210, 24, 74)";
  hue_hcl2["N2104"] = "hcl(210, 30, 66)";
  hue_hcl2["N2105"] = "hcl(210, 36, 58)";
  hue_hcl2["N2106"] = "hcl(210, 30, 50)";
  hue_hcl2["N2107"] = "hcl(210, 24, 42)";
  hue_hcl2["N2108"] = "hcl(210, 18, 34)";
  hue_hcl2["N2109"] = "hcl(210, 12, 26)";
  hue_hcl2["N2251"] = "hcl(225, 12, 90)";
  hue_hcl2["N2252"] = "hcl(225, 18, 82)";
  hue_hcl2["N2253"] = "hcl(225, 24, 74)";
  hue_hcl2["N2254"] = "hcl(225, 30, 66)";
  hue_hcl2["N2255"] = "hcl(225, 36, 58)";
  hue_hcl2["N2256"] = "hcl(225, 30, 50)";
  hue_hcl2["N2257"] = "hcl(225, 24, 42)";
  hue_hcl2["N2258"] = "hcl(225, 18, 34)";
  hue_hcl2["N2259"] = "hcl(225, 12, 26)";
  hue_hcl2["N2401"] = "hcl(240, 12, 90)";
  hue_hcl2["N2402"] = "hcl(240, 18, 82)";
  hue_hcl2["N2403"] = "hcl(240, 24, 74)";
  hue_hcl2["N2404"] = "hcl(240, 30, 66)";
  hue_hcl2["N2405"] = "hcl(240, 36, 58)";
  hue_hcl2["N2406"] = "hcl(240, 30, 50)";
  hue_hcl2["N2407"] = "hcl(240, 24, 42)";
  hue_hcl2["N2408"] = "hcl(240, 18, 34)";
  hue_hcl2["N2409"] = "hcl(240, 12, 26)";
  hue_hcl2["N2551"] = "hcl(255, 12, 90)";
  hue_hcl2["N2552"] = "hcl(255, 18, 82)";
  hue_hcl2["N2553"] = "hcl(255, 24, 74)";
  hue_hcl2["N2554"] = "hcl(255, 30, 66)";
  hue_hcl2["N2555"] = "hcl(255, 36, 58)";
  hue_hcl2["N2556"] = "hcl(255, 30, 50)";
  hue_hcl2["N2557"] = "hcl(255, 24, 42)";
  hue_hcl2["N2558"] = "hcl(255, 18, 34)";
  hue_hcl2["N2559"] = "hcl(255, 12, 26)";
  hue_hcl2["N2701"] = "hcl(270, 12, 90)";
  hue_hcl2["N2702"] = "hcl(270, 18, 82)";
  hue_hcl2["N2703"] = "hcl(270, 24, 74)";
  hue_hcl2["N2704"] = "hcl(270, 30, 66)";
  hue_hcl2["N2705"] = "hcl(270, 36, 58)";
  hue_hcl2["N2706"] = "hcl(270, 30, 50)";
  hue_hcl2["N2707"] = "hcl(270, 24, 42)";
  hue_hcl2["N2708"] = "hcl(270, 18, 34)";
  hue_hcl2["N2709"] = "hcl(270, 12, 26)";
  hue_hcl2["N2851"] = "hcl(285, 12, 90)";
  hue_hcl2["N2852"] = "hcl(285, 18, 82)";
  hue_hcl2["N2853"] = "hcl(285, 24, 74)";
  hue_hcl2["N2854"] = "hcl(285, 30, 66)";
  hue_hcl2["N2855"] = "hcl(285, 36, 58)";
  hue_hcl2["N2856"] = "hcl(285, 30, 50)";
  hue_hcl2["N2857"] = "hcl(285, 24, 42)";
  hue_hcl2["N2858"] = "hcl(285, 18, 34)";
  hue_hcl2["N2859"] = "hcl(285, 12, 26)";
  hue_hcl2["N3001"] = "hcl(300, 12, 90)";
  hue_hcl2["N3002"] = "hcl(300, 18, 82)";
  hue_hcl2["N3003"] = "hcl(300, 24, 74)";
  hue_hcl2["N3004"] = "hcl(300, 30, 66)";
  hue_hcl2["N3005"] = "hcl(300, 36, 58)";
  hue_hcl2["N3006"] = "hcl(300, 30, 50)";
  hue_hcl2["N3007"] = "hcl(300, 24, 42)";
  hue_hcl2["N3008"] = "hcl(300, 18, 34)";
  hue_hcl2["N3009"] = "hcl(300, 12, 26)";
  hue_hcl2["N3151"] = "hcl(315, 12, 90)";
  hue_hcl2["N3152"] = "hcl(315, 18, 82)";
  hue_hcl2["N3153"] = "hcl(315, 24, 74)";
  hue_hcl2["N3154"] = "hcl(315, 30, 66)";
  hue_hcl2["N3155"] = "hcl(315, 36, 58)";
  hue_hcl2["N3156"] = "hcl(315, 30, 50)";
  hue_hcl2["N3157"] = "hcl(315, 24, 42)";
  hue_hcl2["N3158"] = "hcl(315, 18, 34)";
  hue_hcl2["N3159"] = "hcl(315, 12, 26)";
  hue_hcl2["N3301"] = "hcl(330, 12, 90)";
  hue_hcl2["N3302"] = "hcl(330, 18, 82)";
  hue_hcl2["N3303"] = "hcl(330, 24, 74)";
  hue_hcl2["N3304"] = "hcl(330, 30, 66)";
  hue_hcl2["N3305"] = "hcl(330, 36, 58)";
  hue_hcl2["N3306"] = "hcl(330, 30, 50)";
  hue_hcl2["N3307"] = "hcl(330, 24, 42)";
  hue_hcl2["N3308"] = "hcl(330, 18, 34)";
  hue_hcl2["N3309"] = "hcl(330, 12, 26)";
  hue_hcl2["N3451"] = "hcl(345, 12, 90)";
  hue_hcl2["N3452"] = "hcl(345, 18, 82)";
  hue_hcl2["N3453"] = "hcl(345, 24, 74)";
  hue_hcl2["N3454"] = "hcl(345, 30, 66)";
  hue_hcl2["N3455"] = "hcl(345, 36, 58)";
  hue_hcl2["N3456"] = "hcl(345, 30, 50)";
  hue_hcl2["N3457"] = "hcl(345, 24, 42)";
  hue_hcl2["N3458"] = "hcl(345, 18, 34)";
  hue_hcl2["N3459"] = "hcl(345, 12, 26)";
  hue_hcl2["N3601"] = "hcl(360, 12, 90)";
  hue_hcl2["N3602"] = "hcl(360, 18, 82)";
  hue_hcl2["N3603"] = "hcl(360, 24, 74)";
  hue_hcl2["N3604"] = "hcl(360, 30, 66)";
  hue_hcl2["N3605"] = "hcl(360, 36, 58)";
  hue_hcl2["N3606"] = "hcl(360, 30, 50)";
  hue_hcl2["N3607"] = "hcl(360, 24, 42)";
  hue_hcl2["N3608"] = "hcl(360, 18, 34)";
  hue_hcl2["N3609"] = "hcl(360, 12, 26)";
  return hue_hcl2;
})(hue_hcl || {});

// src/ts/constants/hue_hex.ts
var hue_hex = /* @__PURE__ */ ((hue_hex2) => {
  hue_hex2["N0001"] = "#e2e2e2";
  hue_hex2["N0002"] = "#cccccc";
  hue_hex2["N0003"] = "#b6b6b6";
  hue_hex2["N0004"] = "#a0a0a0";
  hue_hex2["N0005"] = "#8b8b8b";
  hue_hex2["N0006"] = "#777777";
  hue_hex2["N0007"] = "#636363";
  hue_hex2["N0008"] = "#505050";
  hue_hex2["N0009"] = "#3e3e3e";
  hue_hex2["N0151"] = "#fadbdd";
  hue_hex2["N0152"] = "#eec0c4";
  hue_hex2["N0153"] = "#e2a6ac";
  hue_hex2["N0154"] = "#d48c94";
  hue_hex2["N0155"] = "#c6727d";
  hue_hex2["N0156"] = "#a7636b";
  hue_hex2["N0157"] = "#89545a";
  hue_hex2["N0158"] = "#6b4549";
  hue_hex2["N0159"] = "#4f3739";
  hue_hex2["N0301"] = "#fadbd7";
  hue_hex2["N0302"] = "#edc1bc";
  hue_hex2["N0303"] = "#e0a8a1";
  hue_hex2["N0304"] = "#d28e87";
  hue_hex2["N0305"] = "#c4756e";
  hue_hex2["N0306"] = "#a5655f";
  hue_hex2["N0307"] = "#875650";
  hue_hex2["N0308"] = "#6b4642";
  hue_hex2["N0309"] = "#4f3835";
  hue_hex2["N0451"] = "#f8dcd3";
  hue_hex2["N0452"] = "#eac3b5";
  hue_hex2["N0453"] = "#dcaa98";
  hue_hex2["N0454"] = "#cd927c";
  hue_hex2["N0455"] = "#be7960";
  hue_hex2["N0456"] = "#a06954";
  hue_hex2["N0457"] = "#845848";
  hue_hex2["N0458"] = "#68483c";
  hue_hex2["N0459"] = "#4d3931";
  hue_hex2["N0601"] = "#f4decf";
  hue_hex2["N0602"] = "#e5c6af";
  hue_hex2["N0603"] = "#d5ad90";
  hue_hex2["N0604"] = "#c59672";
  hue_hex2["N0605"] = "#b57f55";
  hue_hex2["N0606"] = "#996d4b";
  hue_hex2["N0607"] = "#7e5b41";
  hue_hex2["N0608"] = "#644a38";
  hue_hex2["N0609"] = "#4a3a2e";
  hue_hex2["N0751"] = "#efe0cc";
  hue_hex2["N0752"] = "#dec8ac";
  hue_hex2["N0753"] = "#cdb18c";
  hue_hex2["N0754"] = "#bb9b6c";
  hue_hex2["N0755"] = "#a9854e";
  hue_hex2["N0756"] = "#8f7145";
  hue_hex2["N0757"] = "#765f3d";
  hue_hex2["N0758"] = "#5e4d34";
  hue_hex2["N0759"] = "#473c2c";
  hue_hex2["N0901"] = "#eae2cb";
  hue_hex2["N0902"] = "#d6cbaa";
  hue_hex2["N0903"] = "#c2b58a";
  hue_hex2["N0904"] = "#af9f6a";
  hue_hex2["N0905"] = "#9b8a4b";
  hue_hex2["N0906"] = "#847643";
  hue_hex2["N0907"] = "#6d623b";
  hue_hex2["N0908"] = "#584f33";
  hue_hex2["N0909"] = "#433d2b";
  hue_hex2["N1051"] = "#e3e4cc";
  hue_hex2["N1052"] = "#cdceab";
  hue_hex2["N1053"] = "#b7b98b";
  hue_hex2["N1054"] = "#a1a46b";
  hue_hex2["N1055"] = "#8b8f4c";
  hue_hex2["N1056"] = "#777a44";
  hue_hex2["N1057"] = "#63663c";
  hue_hex2["N1058"] = "#505234";
  hue_hex2["N1059"] = "#3e3f2c";
  hue_hex2["N1201"] = "#dde6ce";
  hue_hex2["N1202"] = "#c4d1ae";
  hue_hex2["N1203"] = "#abbc8f";
  hue_hex2["N1204"] = "#92a870";
  hue_hex2["N1205"] = "#7a9453";
  hue_hex2["N1206"] = "#697e49";
  hue_hex2["N1207"] = "#586840";
  hue_hex2["N1208"] = "#485437";
  hue_hex2["N1209"] = "#39402d";
  hue_hex2["N1351"] = "#d7e7d2";
  hue_hex2["N1352"] = "#bbd3b3";
  hue_hex2["N1353"] = "#9fbf96";
  hue_hex2["N1354"] = "#83ab79";
  hue_hex2["N1355"] = "#68975d";
  hue_hex2["N1356"] = "#5a8151";
  hue_hex2["N1357"] = "#4d6b46";
  hue_hex2["N1358"] = "#40553b";
  hue_hex2["N1359"] = "#344130";
  hue_hex2["N1501"] = "#d1e8d6";
  hue_hex2["N1502"] = "#b2d4ba";
  hue_hex2["N1503"] = "#93c19f";
  hue_hex2["N1504"] = "#74ad84";
  hue_hex2["N1505"] = "#559a6a";
  hue_hex2["N1506"] = "#4b835c";
  hue_hex2["N1507"] = "#426c4e";
  hue_hex2["N1508"] = "#395741";
  hue_hex2["N1509"] = "#2f4234";
  hue_hex2["N1651"] = "#cde9dc";
  hue_hex2["N1652"] = "#abd6c2";
  hue_hex2["N1653"] = "#89c2a9";
  hue_hex2["N1654"] = "#66af91";
  hue_hex2["N1655"] = "#409b7a";
  hue_hex2["N1656"] = "#3c8469";
  hue_hex2["N1657"] = "#376d58";
  hue_hex2["N1658"] = "#315848";
  hue_hex2["N1659"] = "#2b4338";
  hue_hex2["N1801"] = "#c9e9e2";
  hue_hex2["N1802"] = "#a6d6cb";
  hue_hex2["N1803"] = "#81c3b5";
  hue_hex2["N1804"] = "#5baf9f";
  hue_hex2["N1805"] = "#2a9c8a";
  hue_hex2["N1806"] = "#2d8576";
  hue_hex2["N1807"] = "#2d6e62";
  hue_hex2["N1808"] = "#2b584f";
  hue_hex2["N1809"] = "#28433d";
  hue_hex2["N1951"] = "#c8e9e8";
  hue_hex2["N1952"] = "#a3d6d4";
  hue_hex2["N1953"] = "#7dc3c0";
  hue_hex2["N1954"] = "#53afad";
  hue_hex2["N1955"] = "#109c9a";
  hue_hex2["N1956"] = "#208583";
  hue_hex2["N1957"] = "#266e6d";
  hue_hex2["N1958"] = "#275857";
  hue_hex2["N1959"] = "#264342";
  hue_hex2["N2101"] = "#c8e9ed";
  hue_hex2["N2102"] = "#a3d5dc";
  hue_hex2["N2103"] = "#7dc2cb";
  hue_hex2["N2104"] = "#52aeba";
  hue_hex2["N2105"] = "#019baa";
  hue_hex2["N2106"] = "#1c8490";
  hue_hex2["N2107"] = "#246d76";
  hue_hex2["N2108"] = "#27575e";
  hue_hex2["N2109"] = "#264246";
  hue_hex2["N2251"] = "#cae8f2";
  hue_hex2["N2252"] = "#a6d4e3";
  hue_hex2["N2253"] = "#81c0d4";
  hue_hex2["N2254"] = "#58acc6";
  hue_hex2["N2255"] = "#1a99b7";
  hue_hex2["N2256"] = "#25829a";
  hue_hex2["N2257"] = "#2a6c7e";
  hue_hex2["N2258"] = "#2a5664";
  hue_hex2["N2259"] = "#27424a";
  hue_hex2["N2401"] = "#cee6f6";
  hue_hex2["N2402"] = "#acd2e9";
  hue_hex2["N2403"] = "#8abedc";
  hue_hex2["N2404"] = "#65aace";
  hue_hex2["N2405"] = "#3696c1";
  hue_hex2["N2406"] = "#3680a3";
  hue_hex2["N2407"] = "#346a85";
  hue_hex2["N2408"] = "#305568";
  hue_hex2["N2409"] = "#2b414d";
  hue_hex2["N2551"] = "#d3e5f8";
  hue_hex2["N2552"] = "#b5cfec";
  hue_hex2["N2553"] = "#95bbe0";
  hue_hex2["N2554"] = "#75a6d4";
  hue_hex2["N2555"] = "#5192c8";
  hue_hex2["N2556"] = "#497ca8";
  hue_hex2["N2557"] = "#416789";
  hue_hex2["N2558"] = "#39536b";
  hue_hex2["N2559"] = "#303f4f";
  hue_hex2["N2701"] = "#dae3f9";
  hue_hex2["N2702"] = "#becdee";
  hue_hex2["N2703"] = "#a3b7e2";
  hue_hex2["N2704"] = "#87a2d6";
  hue_hex2["N2705"] = "#6a8dca";
  hue_hex2["N2706"] = "#5d78aa";
  hue_hex2["N2707"] = "#4f648b";
  hue_hex2["N2708"] = "#42516c";
  hue_hex2["N2709"] = "#353e50";
  hue_hex2["N2851"] = "#e0e1f9";
  hue_hex2["N2852"] = "#c8caed";
  hue_hex2["N2853"] = "#b1b3e1";
  hue_hex2["N2854"] = "#999dd5";
  hue_hex2["N2855"] = "#8188c8";
  hue_hex2["N2856"] = "#6f74a8";
  hue_hex2["N2857"] = "#5d6189";
  hue_hex2["N2858"] = "#4c4e6c";
  hue_hex2["N2859"] = "#3b3c4f";
  hue_hex2["N3001"] = "#e7dff6";
  hue_hex2["N3002"] = "#d3c7e9";
  hue_hex2["N3003"] = "#beafdc";
  hue_hex2["N3004"] = "#aa98cf";
  hue_hex2["N3005"] = "#9582c2";
  hue_hex2["N3006"] = "#7f6fa3";
  hue_hex2["N3007"] = "#6a5d86";
  hue_hex2["N3008"] = "#554c69";
  hue_hex2["N3009"] = "#413b4d";
  hue_hex2["N3151"] = "#edddf3";
  hue_hex2["N3152"] = "#dcc4e4";
  hue_hex2["N3153"] = "#caacd6";
  hue_hex2["N3154"] = "#b994c7";
  hue_hex2["N3155"] = "#a77cb9";
  hue_hex2["N3156"] = "#8d6b9c";
  hue_hex2["N3157"] = "#755a7f";
  hue_hex2["N3158"] = "#5d4964";
  hue_hex2["N3159"] = "#46394b";
  hue_hex2["N3301"] = "#f3dcee";
  hue_hex2["N3302"] = "#e3c2dd";
  hue_hex2["N3303"] = "#d4a9cd";
  hue_hex2["N3304"] = "#c590bc";
  hue_hex2["N3305"] = "#b577ac";
  hue_hex2["N3306"] = "#996791";
  hue_hex2["N3307"] = "#7d5777";
  hue_hex2["N3308"] = "#63475f";
  hue_hex2["N3309"] = "#4a3847";
  hue_hex2["N3451"] = "#f7dbe9";
  hue_hex2["N3452"] = "#e9c1d5";
  hue_hex2["N3453"] = "#dba7c2";
  hue_hex2["N3454"] = "#cd8daf";
  hue_hex2["N3455"] = "#bf739d";
  hue_hex2["N3456"] = "#a16485";
  hue_hex2["N3457"] = "#84546e";
  hue_hex2["N3458"] = "#684658";
  hue_hex2["N3459"] = "#4d3743";
  hue_hex2["N3601"] = "#f9dbe3";
  hue_hex2["N3602"] = "#edc0cd";
  hue_hex2["N3603"] = "#e0a6b7";
  hue_hex2["N3604"] = "#d38ca2";
  hue_hex2["N3605"] = "#c5728d";
  hue_hex2["N3606"] = "#a66278";
  hue_hex2["N3607"] = "#885464";
  hue_hex2["N3608"] = "#6b4551";
  hue_hex2["N3609"] = "#4f373e";
  return hue_hex2;
})(hue_hex || {});

// src/ts/constants/hue_rgb.ts
var hue_rgb = /* @__PURE__ */ ((hue_rgb2) => {
  hue_rgb2["N0001"] = "rgb(226, 226, 226)";
  hue_rgb2["N0002"] = "rgb(204, 204, 204)";
  hue_rgb2["N0003"] = "rgb(182, 182, 182)";
  hue_rgb2["N0004"] = "rgb(160, 160, 160)";
  hue_rgb2["N0005"] = "rgb(139, 139, 139)";
  hue_rgb2["N0006"] = "rgb(119, 119, 119)";
  hue_rgb2["N0007"] = "rgb(99, 99, 99)";
  hue_rgb2["N0008"] = "rgb(80, 80, 80)";
  hue_rgb2["N0009"] = "rgb(62, 62, 62)";
  hue_rgb2["N0151"] = "rgb(250, 219, 221)";
  hue_rgb2["N0152"] = "rgb(238, 192, 196)";
  hue_rgb2["N0153"] = "rgb(226, 166, 172)";
  hue_rgb2["N0154"] = "rgb(212, 140, 148)";
  hue_rgb2["N0155"] = "rgb(198, 114, 125)";
  hue_rgb2["N0156"] = "rgb(167, 99, 107)";
  hue_rgb2["N0157"] = "rgb(137, 84, 90)";
  hue_rgb2["N0158"] = "rgb(107, 69, 73)";
  hue_rgb2["N0159"] = "rgb(79, 55, 57)";
  hue_rgb2["N0301"] = "rgb(250, 219, 215)";
  hue_rgb2["N0302"] = "rgb(237, 193, 188)";
  hue_rgb2["N0303"] = "rgb(224, 168, 161)";
  hue_rgb2["N0304"] = "rgb(210, 142, 135)";
  hue_rgb2["N0305"] = "rgb(196, 117, 110)";
  hue_rgb2["N0306"] = "rgb(165, 101, 95)";
  hue_rgb2["N0307"] = "rgb(135, 86, 80)";
  hue_rgb2["N0308"] = "rgb(107, 70, 66)";
  hue_rgb2["N0309"] = "rgb(79, 56, 53)";
  hue_rgb2["N0451"] = "rgb(248, 220, 211)";
  hue_rgb2["N0452"] = "rgb(234, 195, 181)";
  hue_rgb2["N0453"] = "rgb(220, 170, 152)";
  hue_rgb2["N0454"] = "rgb(205, 146, 124)";
  hue_rgb2["N0455"] = "rgb(190, 121, 96)";
  hue_rgb2["N0456"] = "rgb(160, 105, 84)";
  hue_rgb2["N0457"] = "rgb(132, 88, 72)";
  hue_rgb2["N0458"] = "rgb(104, 72, 60)";
  hue_rgb2["N0459"] = "rgb(77, 57, 49)";
  hue_rgb2["N0601"] = "rgb(244, 222, 207)";
  hue_rgb2["N0602"] = "rgb(229, 198, 175)";
  hue_rgb2["N0603"] = "rgb(213, 173, 144)";
  hue_rgb2["N0604"] = "rgb(197, 150, 114)";
  hue_rgb2["N0605"] = "rgb(181, 127, 85)";
  hue_rgb2["N0606"] = "rgb(153, 109, 75)";
  hue_rgb2["N0607"] = "rgb(126, 91, 65)";
  hue_rgb2["N0608"] = "rgb(100, 74, 56)";
  hue_rgb2["N0609"] = "rgb(74, 58, 46)";
  hue_rgb2["N0751"] = "rgb(239, 224, 204)";
  hue_rgb2["N0752"] = "rgb(222, 200, 172)";
  hue_rgb2["N0753"] = "rgb(205, 177, 140)";
  hue_rgb2["N0754"] = "rgb(187, 155, 108)";
  hue_rgb2["N0755"] = "rgb(169, 133, 78)";
  hue_rgb2["N0756"] = "rgb(143, 113, 69)";
  hue_rgb2["N0757"] = "rgb(118, 95, 61)";
  hue_rgb2["N0758"] = "rgb(94, 77, 52)";
  hue_rgb2["N0759"] = "rgb(71, 60, 44)";
  hue_rgb2["N0901"] = "rgb(234, 226, 203)";
  hue_rgb2["N0902"] = "rgb(214, 203, 170)";
  hue_rgb2["N0903"] = "rgb(194, 181, 138)";
  hue_rgb2["N0904"] = "rgb(175, 159, 106)";
  hue_rgb2["N0905"] = "rgb(155, 138, 75)";
  hue_rgb2["N0906"] = "rgb(132, 118, 67)";
  hue_rgb2["N0907"] = "rgb(109, 98, 59)";
  hue_rgb2["N0908"] = "rgb(88, 79, 51)";
  hue_rgb2["N0909"] = "rgb(67, 61, 43)";
  hue_rgb2["N1051"] = "rgb(227, 228, 204)";
  hue_rgb2["N1052"] = "rgb(205, 206, 171)";
  hue_rgb2["N1053"] = "rgb(183, 185, 139)";
  hue_rgb2["N1054"] = "rgb(161, 164, 107)";
  hue_rgb2["N1055"] = "rgb(139, 143, 76)";
  hue_rgb2["N1056"] = "rgb(119, 122, 68)";
  hue_rgb2["N1057"] = "rgb(99, 102, 60)";
  hue_rgb2["N1058"] = "rgb(80, 82, 52)";
  hue_rgb2["N1059"] = "rgb(62, 63, 44)";
  hue_rgb2["N1201"] = "rgb(221, 230, 206)";
  hue_rgb2["N1202"] = "rgb(196, 209, 174)";
  hue_rgb2["N1203"] = "rgb(171, 188, 143)";
  hue_rgb2["N1204"] = "rgb(146, 168, 112)";
  hue_rgb2["N1205"] = "rgb(122, 148, 83)";
  hue_rgb2["N1206"] = "rgb(105, 126, 73)";
  hue_rgb2["N1207"] = "rgb(88, 104, 64)";
  hue_rgb2["N1208"] = "rgb(72, 84, 55)";
  hue_rgb2["N1209"] = "rgb(57, 64, 45)";
  hue_rgb2["N1351"] = "rgb(215, 231, 210)";
  hue_rgb2["N1352"] = "rgb(187, 211, 179)";
  hue_rgb2["N1353"] = "rgb(159, 191, 150)";
  hue_rgb2["N1354"] = "rgb(131, 171, 121)";
  hue_rgb2["N1355"] = "rgb(104, 151, 93)";
  hue_rgb2["N1356"] = "rgb(90, 129, 81)";
  hue_rgb2["N1357"] = "rgb(77, 107, 70)";
  hue_rgb2["N1358"] = "rgb(64, 85, 59)";
  hue_rgb2["N1359"] = "rgb(52, 65, 48)";
  hue_rgb2["N1501"] = "rgb(209, 232, 214)";
  hue_rgb2["N1502"] = "rgb(178, 212, 186)";
  hue_rgb2["N1503"] = "rgb(147, 193, 159)";
  hue_rgb2["N1504"] = "rgb(116, 173, 132)";
  hue_rgb2["N1505"] = "rgb(85, 154, 106)";
  hue_rgb2["N1506"] = "rgb(75, 131, 92)";
  hue_rgb2["N1507"] = "rgb(66, 108, 78)";
  hue_rgb2["N1508"] = "rgb(57, 87, 65)";
  hue_rgb2["N1509"] = "rgb(47, 66, 52)";
  hue_rgb2["N1651"] = "rgb(205, 233, 220)";
  hue_rgb2["N1652"] = "rgb(171, 214, 194)";
  hue_rgb2["N1653"] = "rgb(137, 194, 169)";
  hue_rgb2["N1654"] = "rgb(102, 175, 145)";
  hue_rgb2["N1655"] = "rgb(64, 155, 122)";
  hue_rgb2["N1656"] = "rgb(60, 132, 105)";
  hue_rgb2["N1657"] = "rgb(55, 109, 88)";
  hue_rgb2["N1658"] = "rgb(49, 88, 72)";
  hue_rgb2["N1659"] = "rgb(43, 67, 56)";
  hue_rgb2["N1801"] = "rgb(201, 233, 226)";
  hue_rgb2["N1802"] = "rgb(166, 214, 203)";
  hue_rgb2["N1803"] = "rgb(129, 195, 181)";
  hue_rgb2["N1804"] = "rgb(91, 175, 159)";
  hue_rgb2["N1805"] = "rgb(42, 156, 138)";
  hue_rgb2["N1806"] = "rgb(45, 133, 118)";
  hue_rgb2["N1807"] = "rgb(45, 110, 98)";
  hue_rgb2["N1808"] = "rgb(43, 88, 79)";
  hue_rgb2["N1809"] = "rgb(40, 67, 61)";
  hue_rgb2["N1951"] = "rgb(200, 233, 232)";
  hue_rgb2["N1952"] = "rgb(163, 214, 212)";
  hue_rgb2["N1953"] = "rgb(125, 195, 192)";
  hue_rgb2["N1954"] = "rgb(83, 175, 173)";
  hue_rgb2["N1955"] = "rgb(16, 156, 154)";
  hue_rgb2["N1956"] = "rgb(32, 133, 131)";
  hue_rgb2["N1957"] = "rgb(38, 110, 109)";
  hue_rgb2["N1958"] = "rgb(39, 88, 87)";
  hue_rgb2["N1959"] = "rgb(38, 67, 66)";
  hue_rgb2["N2101"] = "rgb(200, 233, 237)";
  hue_rgb2["N2102"] = "rgb(163, 213, 220)";
  hue_rgb2["N2103"] = "rgb(125, 194, 203)";
  hue_rgb2["N2104"] = "rgb(82, 174, 186)";
  hue_rgb2["N2105"] = "rgb(1, 155, 170)";
  hue_rgb2["N2106"] = "rgb(28, 132, 144)";
  hue_rgb2["N2107"] = "rgb(36, 109, 118)";
  hue_rgb2["N2108"] = "rgb(39, 87, 94)";
  hue_rgb2["N2109"] = "rgb(38, 66, 70)";
  hue_rgb2["N2251"] = "rgb(202, 232, 242)";
  hue_rgb2["N2252"] = "rgb(166, 212, 227)";
  hue_rgb2["N2253"] = "rgb(129, 192, 212)";
  hue_rgb2["N2254"] = "rgb(88, 172, 198)";
  hue_rgb2["N2255"] = "rgb(26, 153, 183)";
  hue_rgb2["N2256"] = "rgb(37, 130, 154)";
  hue_rgb2["N2257"] = "rgb(42, 108, 126)";
  hue_rgb2["N2258"] = "rgb(42, 86, 100)";
  hue_rgb2["N2259"] = "rgb(39, 66, 74)";
  hue_rgb2["N2401"] = "rgb(206, 230, 246)";
  hue_rgb2["N2402"] = "rgb(172, 210, 233)";
  hue_rgb2["N2403"] = "rgb(138, 190, 220)";
  hue_rgb2["N2404"] = "rgb(101, 170, 206)";
  hue_rgb2["N2405"] = "rgb(54, 150, 193)";
  hue_rgb2["N2406"] = "rgb(54, 128, 163)";
  hue_rgb2["N2407"] = "rgb(52, 106, 133)";
  hue_rgb2["N2408"] = "rgb(48, 85, 104)";
  hue_rgb2["N2409"] = "rgb(43, 65, 77)";
  hue_rgb2["N2551"] = "rgb(211, 229, 248)";
  hue_rgb2["N2552"] = "rgb(181, 207, 236)";
  hue_rgb2["N2553"] = "rgb(149, 187, 224)";
  hue_rgb2["N2554"] = "rgb(117, 166, 212)";
  hue_rgb2["N2555"] = "rgb(81, 146, 200)";
  hue_rgb2["N2556"] = "rgb(73, 124, 168)";
  hue_rgb2["N2557"] = "rgb(65, 103, 137)";
  hue_rgb2["N2558"] = "rgb(57, 83, 107)";
  hue_rgb2["N2559"] = "rgb(48, 63, 79)";
  hue_rgb2["N2701"] = "rgb(218, 227, 249)";
  hue_rgb2["N2702"] = "rgb(190, 205, 238)";
  hue_rgb2["N2703"] = "rgb(163, 183, 226)";
  hue_rgb2["N2704"] = "rgb(135, 162, 214)";
  hue_rgb2["N2705"] = "rgb(106, 141, 202)";
  hue_rgb2["N2706"] = "rgb(93, 120, 170)";
  hue_rgb2["N2707"] = "rgb(79, 100, 139)";
  hue_rgb2["N2708"] = "rgb(66, 81, 108)";
  hue_rgb2["N2709"] = "rgb(53, 62, 80)";
  hue_rgb2["N2851"] = "rgb(224, 225, 249)";
  hue_rgb2["N2852"] = "rgb(200, 202, 237)";
  hue_rgb2["N2853"] = "rgb(177, 179, 225)";
  hue_rgb2["N2854"] = "rgb(153, 157, 213)";
  hue_rgb2["N2855"] = "rgb(129, 136, 200)";
  hue_rgb2["N2856"] = "rgb(111, 116, 168)";
  hue_rgb2["N2857"] = "rgb(93, 97, 137)";
  hue_rgb2["N2858"] = "rgb(76, 78, 108)";
  hue_rgb2["N2859"] = "rgb(59, 60, 79)";
  hue_rgb2["N3001"] = "rgb(231, 223, 246)";
  hue_rgb2["N3002"] = "rgb(211, 199, 233)";
  hue_rgb2["N3003"] = "rgb(190, 175, 220)";
  hue_rgb2["N3004"] = "rgb(170, 152, 207)";
  hue_rgb2["N3005"] = "rgb(149, 130, 194)";
  hue_rgb2["N3006"] = "rgb(127, 111, 163)";
  hue_rgb2["N3007"] = "rgb(106, 93, 134)";
  hue_rgb2["N3008"] = "rgb(85, 76, 105)";
  hue_rgb2["N3009"] = "rgb(65, 59, 77)";
  hue_rgb2["N3151"] = "rgb(237, 221, 243)";
  hue_rgb2["N3152"] = "rgb(220, 196, 228)";
  hue_rgb2["N3153"] = "rgb(202, 172, 214)";
  hue_rgb2["N3154"] = "rgb(185, 148, 199)";
  hue_rgb2["N3155"] = "rgb(167, 124, 185)";
  hue_rgb2["N3156"] = "rgb(141, 107, 156)";
  hue_rgb2["N3157"] = "rgb(117, 90, 127)";
  hue_rgb2["N3158"] = "rgb(93, 73, 100)";
  hue_rgb2["N3159"] = "rgb(70, 57, 75)";
  hue_rgb2["N3301"] = "rgb(243, 220, 238)";
  hue_rgb2["N3302"] = "rgb(227, 194, 221)";
  hue_rgb2["N3303"] = "rgb(212, 169, 205)";
  hue_rgb2["N3304"] = "rgb(197, 144, 188)";
  hue_rgb2["N3305"] = "rgb(181, 119, 172)";
  hue_rgb2["N3306"] = "rgb(153, 103, 145)";
  hue_rgb2["N3307"] = "rgb(125, 87, 119)";
  hue_rgb2["N3308"] = "rgb(99, 71, 95)";
  hue_rgb2["N3309"] = "rgb(74, 56, 71)";
  hue_rgb2["N3451"] = "rgb(247, 219, 233)";
  hue_rgb2["N3452"] = "rgb(233, 193, 213)";
  hue_rgb2["N3453"] = "rgb(219, 167, 194)";
  hue_rgb2["N3454"] = "rgb(205, 141, 175)";
  hue_rgb2["N3455"] = "rgb(191, 115, 157)";
  hue_rgb2["N3456"] = "rgb(161, 100, 133)";
  hue_rgb2["N3457"] = "rgb(132, 84, 110)";
  hue_rgb2["N3458"] = "rgb(104, 70, 88)";
  hue_rgb2["N3459"] = "rgb(77, 55, 67)";
  hue_rgb2["N3601"] = "rgb(249, 219, 227)";
  hue_rgb2["N3602"] = "rgb(237, 192, 205)";
  hue_rgb2["N3603"] = "rgb(224, 166, 183)";
  hue_rgb2["N3604"] = "rgb(211, 140, 162)";
  hue_rgb2["N3605"] = "rgb(197, 114, 141)";
  hue_rgb2["N3606"] = "rgb(166, 98, 120)";
  hue_rgb2["N3607"] = "rgb(136, 84, 100)";
  hue_rgb2["N3608"] = "rgb(107, 69, 81)";
  hue_rgb2["N3609"] = "rgb(79, 55, 62)";
  return hue_rgb2;
})(hue_rgb || {});

// src/ts/color/ColorPicker.ts
var ColorPicker = class {
  /**
   * Retrieves a color value by its enum key.
   *
   * This method allows for fetching a color value using a defined enum type
   * and a key specific to that enum"s color model. The method supports
   * various color models such as RGB, HCL, and HEX.
   *
   * @param colorEnum The enum type to pick the color from. Possible values
   * are "RGB", "HSL", "HCL", "HEX".
   * @param colorKey The key of the color in the specified enum. This is
   * expected to be a valid key within the respective color dictionary.
   * @returns The color value as a string (if found), or null if the key
   * does not exist in the specified enum.
   */
  static get(colorEnum, colorKey) {
    let color;
    switch (colorEnum) {
      case "RGB":
        return hue_rgb[colorKey] || null;
      // break;
      case "HCL":
        return hue_hcl[colorKey] || null;
      // break;
      case "HEX":
        return hue_hex[colorKey] || null;
      // break;
      default:
        return null;
    }
  }
};

// src/ts/util.ts
function pad(num, size, char) {
  num = num.toString();
  while (num.length < size) num = char + num;
  return num;
}

// src/ts/color/ColorSwatch.ts
var ColorSwatch = class {
  constructor(h, c, l, name) {
    this.h = 0;
    // Hue (0-360)
    this.c = 0;
    // Chroma (0-150+)
    this.l = 0;
    if (h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
      throw new Error("Invalid HCL values");
    }
    this.h = h;
    this.c = c;
    this.l = l;
    this.name = name;
    this.model = new Color("lch", [l, c, h]);
  }
  setHCL(h, c, l) {
    if (h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
      throw new Error("Invalid HCL values");
    }
    this.h = h;
    this.c = c;
    this.l = l;
  }
  /// Color Gamut Checks
  checkGamut() {
    const rgb = lchToSrgb(this.l, this.c, this.h);
    return isInGamut(rgb[0], rgb[1], rgb[2]);
  }
  getName() {
    return this.name;
  }
  getRGB() {
    return lchToSrgb255(this.l, this.c, this.h);
  }
  // Color Space Conversions
  // ========================================================================
  a98rgb() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  a98rgb_linear() {
    let color = this.model.to("srgb-linear");
    return color.coords;
  }
  acescg() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  hsl() {
    let color = this.model.to("hsl");
    return color.coords;
  }
  hsv() {
    const rgb = this.model.coords;
    const r = clamp(rgb[0], 0, 1);
    const g = clamp(rgb[1], 0, 1);
    const b = clamp(rgb[2], 0, 1);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return [h * 360, s * 100, v * 100];
  }
  hwb() {
    const rgb = this.model.coords;
    const r = clamp(rgb[0], 0, 1);
    const g = clamp(rgb[1], 0, 1);
    const b = clamp(rgb[2], 0, 1);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return [h * 360, min * 100, (1 - max) * 100];
  }
  ictcp() {
    let color = this.model.to("xyz-d65");
    return color.coords;
  }
  jzczhz() {
    let color = this.model.to("lch");
    return color.coords;
  }
  jzazbz() {
    let color = this.model.to("lab");
    return color.coords;
  }
  lab() {
    let color = this.model.to("lab");
    return color.coords;
  }
  lab_d65() {
    let color = this.model.to("lab");
    return color.coords;
  }
  lch() {
    let color = this.model.to("lch");
    return color.coords;
  }
  oklch() {
    let color = this.model.to("lch");
    return color.coords;
  }
  oklab() {
    let color = this.model.to("lab");
    return color.coords;
  }
  p3() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  p3_linear() {
    let color = this.model.to("srgb-linear");
    return color.coords;
  }
  prophoto() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  prophoto_linear() {
    let color = this.model.to("srgb-linear");
    return color.coords;
  }
  rec2020() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  rec2020_linear() {
    let color = this.model.to("srgb-linear");
    return color.coords;
  }
  rec2100hlg() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  rec2100pq() {
    let color = this.model.to("srgb");
    return color.coords;
  }
  xyz_abs_d65() {
    let color = this.model.to("xyz-d65");
    return color.coords;
  }
  xyz_d50() {
    let color = this.model.to("xyz-d50");
    return color.coords;
  }
  xyz_d65() {
    let color = this.model.to("xyz-d65");
    return color.coords;
  }
  xyz() {
    let color = this.model.to("xyz");
    return color.coords;
  }
  srgb() {
    let color = this.model.to("srgb");
    return color;
  }
  srgb_linear() {
    let color = this.model.to("srgb-linear");
    return color.coords;
  }
  hex() {
    const rgb = lchToSrgb(this.l, this.c, this.h);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
  }
  hcl() {
    return {
      "h": this.h,
      "c": this.c,
      "l": this.l
    };
  }
  rgb() {
    const [r, g, b] = this.getRGB();
    return {
      "r": r,
      "g": g,
      "b": b
    };
  }
  toString() {
    const [r, g, b] = this.getRGB();
    return `rgb(${r}, ${g}, ${b})`;
  }
  toDict() {
    return {
      name: this.name,
      hcl_h: this.h,
      hcl_c: this.c,
      hcl_l: this.l
    };
  }
};

// src/ts/color/ColorScheme.ts
var ColorScheme = class {
  // Dictionary organized by hues and color names.
  /**
   * Initializes a new color scheme with the given configuration and naming conventions.
   * @param config Configuration for the color scheme generation.
   * @param names Dictionary for naming colors based on their hue value.
   */
  constructor(config, names) {
    this.config = config;
    this.names = names;
    this.colorList = [];
    this.colorDict = {};
    this.initializeColors();
  }
  /**
   * Populates `colorList` and `colorDict` with `ColorSwatch` objects based
   * on the current configuration.
   */
  initializeColors() {
    const l_count = Math.ceil(this.config.p_count / 2);
    const d_count = Math.floor(this.config.p_count / 2);
    const d_l_min = this.config.l_l_min + this.config.l_l_step * (l_count - 1);
    const d_c_min = this.config.l_c_min + this.config.l_c_step * (l_count - 1);
    const l_list = [];
    const c_list = [];
    for (let i = 0; i < this.config.p_count; i++) {
      let l_cur = this.config.l_l_min + this.config.l_l_step + i * this.config.l_l_step - 2 * i;
      l_list.push(l_cur);
    }
    ;
    for (let i = 0; i < l_count; i++) {
      let c_cur = this.config.l_c_min + i * this.config.l_c_step;
      c_list.push(c_cur);
    }
    ;
    for (let i = 0; i < d_count; i++) {
      let c_cur = d_c_min + this.config.d_c_step + i * this.config.d_c_step;
      c_list.push(c_cur);
    }
    ;
    for (let h = 0; h <= 360; h += this.config.h_step) {
      let h_group = {};
      let h_group_name = this.names[h];
      ;
      for (let i = 0; i < this.config.p_count; i++) {
        let l_cur = l_list[i];
        let c_cur = c_list[i];
        if (h == 0) {
          c_cur = 0;
        }
        ;
        let name = this.config.prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
        let color = new ColorSwatch(h, c_cur, l_cur, name);
        this.colorList.push(color);
        h_group[name] = color;
      }
      ;
      this.colorDict[h_group_name] = h_group;
    }
  }
  /**
   * Returns the list of all generated color swatches.
   * @returns An array of ColorSwatch objects.
   */
  getColorList() {
    return this.colorList;
  }
  /**
   * Returns a dictionary of color swatches organized by hue groups.
   * @returns A dictionary with hue values as keys and another dictionary of
   * ColorSwatch objects as values.
   */
  getColorDict() {
    return this.colorDict;
  }
};

// src/ts/config/hue.config.ts
var hueConfig = {
  prefix: "N",
  h_step: 15,
  p_count: 9,
  l_l_min: 96,
  l_l_step: -6,
  d_l_step: -6,
  l_c_min: 12,
  l_c_step: 6,
  d_c_step: -6
};

// src/ts/config/hue.names.ts
var hueNames = {
  0: "Grey",
  15: "Salmon",
  30: "Orange",
  45: "Amber",
  60: "Yellow",
  // Fixed
  75: "Lime",
  90: "Ecru",
  105: "Olive",
  120: "Green",
  // Fixed
  135: "Forest",
  150: "Jade",
  165: "Mint",
  180: "Cyan",
  // Fixed
  195: "Teal",
  210: "Capri",
  225: "Sky",
  240: "Blue",
  // Fixed
  255: "Azure",
  270: "Indigo",
  285: "Violet",
  300: "Magenta",
  // Fixed
  315: "Purple",
  330: "Rose",
  345: "Pink",
  360: "Red"
  // Fixed
};
export {
  ColorPicker,
  ColorScheme,
  ColorSwatch,
  hueConfig,
  hueNames,
  hue_hcl,
  hue_hex,
  hue_rgb
};
//# sourceMappingURL=index.mjs.map