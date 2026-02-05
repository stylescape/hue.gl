import { clamp, Color, isInGamut, lchToSrgb, lchToSrgb255, rgbToHex } from "./ColorConverter";
export class ColorSwatch {
    constructor(h, c, l, name) {
        this.h = 0;
        this.c = 0;
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
            "l": this.l,
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
            hcl_l: this.l,
        };
    }
}
export default ColorSwatch;
//# sourceMappingURL=ColorSwatch.js.map