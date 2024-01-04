import Color from 'colorjs.io';
import { convertRGBtoHex } from '../util.js';
class ColorSwatch {
    constructor(h, c, l, name) {
        this.h = 0;
        this.c = 0;
        this.l = 0;
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
        this.name = name;
        this.model = new Color("lch", [l, c, h]);
        ;
    }
    setHCL(h, c, l) {
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
    }
    checkGamut(color_constant) {
        let lch_in_gamut = (color_constant.to("lch")).inGamut();
        let srgb_in_gamut = (color_constant.to("srgb")).inGamut();
        let argb_in_gamut = (color_constant.to("a98rgb")).inGamut();
        let in_gamut;
        if (lch_in_gamut == false ||
            srgb_in_gamut == false ||
            argb_in_gamut == false) {
            in_gamut = false;
        }
        else {
            in_gamut = true;
        }
        return in_gamut;
    }
    getName() {
        return this.name;
    }
    getRGB() {
        return [0, 0, 0];
    }
    a98rgb() {
        let color = this.model.to("a98rgb");
        return color.coords;
    }
    a98rgb_linear() {
        let color = this.model.to("a98rgb-linear");
        return color.coords;
    }
    acescg() {
        let color = this.model.to("acescg");
        return color.coords;
    }
    hsl() {
        let color = this.model.to("hsl");
        return color.coords;
    }
    hsv() {
        let color = this.model.to("hsv");
        return color.coords;
    }
    hwb() {
        let color = this.model.to("hwb");
        return color.coords;
    }
    ictcp() {
        let color = this.model.to("ictcp");
        return color.coords;
    }
    jzczhz() {
        let color = this.model.to("jzczhz");
        return color.coords;
    }
    jzazbz() {
        let color = this.model.to("jzazbz");
        return color.coords;
    }
    lab() {
        let color = this.model.to("lab");
        return color.coords;
    }
    lab_d65() {
        let color = this.model.to("lab-d65");
        return color.coords;
    }
    lch() {
        let color = this.model.to("lch");
        return color.coords;
    }
    oklch() {
        let color = this.model.to("oklch");
        return color.coords;
    }
    oklab() {
        let color = this.model.to("oklab");
        return color.coords;
    }
    p3() {
        let color = this.model.to("p3");
        return color.coords;
    }
    p3_linear() {
        let color = this.model.to("p3-linear");
        return color.coords;
    }
    prophoto() {
        let color = this.model.to("prophoto");
        return color.coords;
    }
    prophoto_linear() {
        let color = this.model.to("prophoto-linear");
        return color.coords;
    }
    rec2020() {
        let color = this.model.to("rec2020");
        return color.coords;
    }
    rec2020_linear() {
        let color = this.model.to("rec2020-linear");
        return color.coords;
    }
    rec2100hlg() {
        let color = this.model.to("rec2100hlg");
        return color.coords;
    }
    rec2100pq() {
        let color = this.model.to("rec2100pq");
        return color.coords;
    }
    xyz_abs_d65() {
        let color = this.model.to("xyz-abs-d65");
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
        let color = this.srgb();
        let hex = convertRGBtoHex(Math.round(color.coords[0] * 255), Math.round(color.coords[1] * 255), Math.round(color.coords[2] * 255));
        return hex;
    }
    hcl() {
        let hcl = {
            "h": this.h,
            "c": this.c,
            "l": this.l,
        };
        return hcl;
    }
    rgb() {
        let color = this.srgb();
        let rgb = {
            "r": Math.round(color.coords[0] * 255),
            "g": Math.round(color.coords[1] * 255),
            "b": Math.round(color.coords[2] * 255)
        };
        return rgb;
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