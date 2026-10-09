// ============================================================================
// Import
// ============================================================================

import {
    hue_hcl,
    hue_hex,
    hue_rgb,
} from "../constants";
import { hexToRgb, srgbToHsl } from "./ColorConverter";


// ============================================================================
// Types
// ============================================================================

/**
 * Enumerates the types of color models that are supported by the ColorPicker.
 */
export type ColorEnum = "RGB" | "HSL" | "HCL" | "HEX";

/**
 * Key of a hue.gl colour, e.g. "N2405".
 */
export type ColorKey = keyof typeof hue_hex;


// ============================================================================
// Functions
// ============================================================================

function lookup<T extends Record<string, string>>(table: T, key: string): string | null {
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : null;
}

function round(value: number): number {
    return Math.round(value * 10) / 10;
}


// ============================================================================
// Classes
// ============================================================================

/**
 * Provides functionality to fetch color values based on a specified color
 * model and key.
 */
export class ColorPicker {

    /**
     * Retrieves a color value by its enum key.
     *
     * @param colorEnum The color model to return: "RGB", "HSL", "HCL" or "HEX".
     * @param colorKey The hue.gl color key, e.g. "N2405".
     * @returns The color value as a CSS string, or null if the key does not
     * exist.
     *
     * @example
     * ColorPicker.get("RGB", "N0001"); // "rgb(226, 226, 226)"
     */
    static get(colorEnum: ColorEnum, colorKey: ColorKey | string): string | null {
        switch (colorEnum) {
            case "RGB":
                return lookup(hue_rgb, colorKey);
            case "HCL":
                return lookup(hue_hcl, colorKey);
            case "HEX":
                return lookup(hue_hex, colorKey);
            case "HSL": {
                const hex = lookup(hue_hex, colorKey);
                if (hex === null) return null;
                const [h, s, l] = srgbToHsl(...hexToRgb(hex));
                return `hsl(${round(h)}, ${round(s)}%, ${round(l)}%)`;
            }
            default:
                return null;
        }
    }

}
