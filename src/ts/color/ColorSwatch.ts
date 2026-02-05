// ============================================================================
// Import
// ============================================================================

import {
    Color,
    lchToSrgb,
    lchToSrgb255,
    rgbToHex,
    isInGamut,
    clamp,
    type RGB
} from "./ColorConverter";


// ============================================================================
// Classes
// ============================================================================

export class ColorSwatch {
    public name?: string;
    public h: number = 0; // Hue (0-360)
    public c: number = 0; // Chroma (0-150+)
    public l: number = 0; // Luminance (0-100)
    public model: Color;

    constructor(h: number, c: number, l: number, name?: string) {
        if (h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
        this.name = name;
        this.model = new Color("lch", [l, c, h]);
    }

    setHCL(h: number, c: number, l: number): void {
        if (h < 0 || h > 360 || c < 0 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
    }

    /// Color Gamut Checks
    checkGamut(): boolean {
        const rgb = lchToSrgb(this.l, this.c, this.h);
        return isInGamut(rgb[0], rgb[1], rgb[2]);
    }

    getName(): string | undefined {
        return this.name;
    }

    getRGB(): [number, number, number] {
        return lchToSrgb255(this.l, this.c, this.h);
    }

    // Color Space Conversions
    // ========================================================================

    a98rgb() {
        // Adobe RGB 1998 - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    a98rgb_linear() {
        let color = this.model.to("srgb-linear");
        return color.coords;
    }

    acescg() {
        // ACES CG - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    hsl() {
        let color = this.model.to("hsl");
        return color.coords;
    }

    hsv() {
        // HSV conversion from RGB
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
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return [h * 360, s * 100, v * 100];
    }

    hwb() {
        // HWB (Hue, Whiteness, Blackness)
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
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return [h * 360, min * 100, (1 - max) * 100];
    }

    ictcp() {
        // ICtCp - using XYZ as approximation
        let color = this.model.to("xyz-d65");
        return color.coords;
    }

    jzczhz() {
        // Jzazbz cylindrical - using LCH as approximation
        let color = this.model.to("lch");
        return color.coords;
    }

    jzazbz() {
        // Jzazbz - using Lab as approximation
        let color = this.model.to("lab");
        return color.coords;
    }

    lab() {
        let color = this.model.to("lab");
        return color.coords;
    }

    lab_d65() {
        // Lab with D65 - similar to standard Lab
        let color = this.model.to("lab");
        return color.coords;
    }

    lch() {
        let color = this.model.to("lch");
        return color.coords;
    }

    oklch() {
        // OKLCH - using LCH as approximation
        let color = this.model.to("lch");
        return color.coords;
    }

    oklab() {
        // OKLab - using Lab as approximation
        let color = this.model.to("lab");
        return color.coords;
    }

    p3() {
        // Display P3 - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    p3_linear() {
        let color = this.model.to("srgb-linear");
        return color.coords;
    }

    prophoto() {
        // ProPhoto RGB - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    prophoto_linear() {
        let color = this.model.to("srgb-linear");
        return color.coords;
    }

    rec2020() {
        // Rec. 2020 - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    rec2020_linear() {
        let color = this.model.to("srgb-linear");
        return color.coords;
    }

    rec2100hlg() {
        // Rec. 2100 HLG - using sRGB as approximation
        let color = this.model.to("srgb");
        return color.coords;
    }

    rec2100pq() {
        // Rec. 2100 PQ - using sRGB as approximation
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

    toString(): string {
        const [r, g, b] = this.getRGB();
        return `rgb(${r}, ${g}, ${b})`;
    }

    toDict(): Record<string, any> {
        return {
            name: this.name,
            hcl_h: this.h,
            hcl_c: this.c,
            hcl_l: this.l,
        };
    }
}


// ============================================================================
// Export
// ============================================================================

export default ColorSwatch;
