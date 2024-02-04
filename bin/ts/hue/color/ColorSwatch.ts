
// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Import
// ============================================================================

import Color from 'colorjs.io';
import { rgb2cmyk, convertRGBtoHex } from '../util.js';


// ============================================================================
// Classes
// ============================================================================

class ColorSwatch {
    private name?: string;
    private h: number = 0; // Hue (0-360)
    private c: number = 0; // Chroma (0-100)
    private l: number = 0; // Luminance (0-100)
    private model: Color;

    constructor(h: number, c: number, l: number, name?: string) {
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
        // this.setHCL(h, c, l);
        this.name = name;
        this.model =  new Color("lch", [l, c, h]);;
    }

    setHCL(h: number, c: number, l: number): void {
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
    }

    /// Color Gamut Checks
    checkGamut(color_constant: Color): boolean {
        let lch_in_gamut = (color_constant.to("lch")).inGamut();
        let srgb_in_gamut = (color_constant.to("srgb")).inGamut();
        let argb_in_gamut = (color_constant.to("a98rgb")).inGamut();
        // console.log(argb_in_gamut);

        let in_gamut;
        if ( 
            lch_in_gamut == false || 
            srgb_in_gamut == false  || 
            argb_in_gamut == false 
        ) {
            in_gamut = false;
            // color_object = new Color("white");
        } else {
            in_gamut = true;

        }
        return in_gamut;
    }



    getName(): string | undefined {
        return this.name;
    }

    // HCL(): [number, number, number] {
    //     return [this.h, this.c, this.l];
    // }

    getRGB(): [number, number, number] {
        // const color_constant = new Color("lch", [l, c, h]);
        // let color_object = color_constant
        // Convert HCL to RGB here
        // This is a non-trivial conversion and may require a detailed algorithm or library
        // Placeholder for conversion logic
        return [0, 0, 0]; // Replace with actual conversion logic
    }

    // Color Space Conversions
    // ========================================================================

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
        let hex = convertRGBtoHex(
            Math.round(color.coords[0]*255),
            Math.round(color.coords[1]*255),
            Math.round(color.coords[2]*255),
        );
        // console.log(color.coords[0]);
        return hex;

    }

    hcl() {
        
        let hcl = {
            "h": this.h,
            "c": this.c,
            "l": this.l,
        }
        return hcl;


    }
    // rgb() {
    //     let color = this.srgb();

    //     let rgb = (
    //         Math.round(color.coords[0]*255),
    //         Math.round(color.coords[1]*255),
    //         Math.round(color.coords[2]*255)
    //     );
    //     return rgb;

    // }

    rgb() {
        let color = this.srgb();

        let rgb = {
            "r": Math.round(color.coords[0]*255),
            "g": Math.round(color.coords[1]*255),
            "b": Math.round(color.coords[2]*255)
        }
        return rgb;

    }

    // cmyk() {
    //     let color_srgb = this.srgb;
    //     let cmyk = rgb2cmyk(
    //         color_srgb[0],
    //         color_srgb[1],
    //         color_srgb[2],
    //         false
    //     );
    //     let color = this.model.to("srgb-linear");
    //     return color.coords;
    // }


        // // Color Strings
        // // --------------------------------------------------------
        // let color_css = color_object

        // let color_string_rgb = color_srgb.toString({precision: 3, format: "rgb"});
        // let color_string_rgba = color_srgb.toString({precision: 3, format: "rgba"});
        // let color_string_hex = color_srgb.toString({precision: 3, format: "hex"});
        // let color_string_color = color_srgb.toString({precision: 3, format: "color"});





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

    // Static methods for creating Color from other formats can be added here
}


// ============================================================================
// Export
// ============================================================================

export default ColorSwatch;
