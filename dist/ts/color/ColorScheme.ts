// ============================================================================
// Import
// ============================================================================

import { hueConfig, hueNames } from "../config";
import { pad } from "../util";
import { ColorSwatch } from "./ColorSwatch";


// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for generating a color scheme, including steps and bounds for
 * color values.
 */
export type ColorSchemeConfig = {
    prefix?: string;   // Optional prefix for color names.
    h_step?: number;   // Step increment for hue values.
    p_count?: number;  // Total count of colors to generate.
    l_l_min?: number;  // Minimum lightness value for light colors.
    l_l_step?: number; // Step increment for lightness values of light colors.
    d_l_step?: number; // Step increment for lightness values of dark colors.
    l_c_min?: number;  // Minimum chroma value for light colors.
    l_c_step?: number; // Step increment for chroma values of light colors.
    d_c_step?: number; // Step increment for chroma values of dark colors.
};

/**
 * Display names for hue groups, keyed by hue angle.
 */
export type ColorSchemeNames = Record<number, string>;

// ============================================================================
// Classes
// ============================================================================

/**
 * A class for creating a customizable color scheme based on provided
 * configurations.
 */
export class ColorScheme {

    public config: Required<ColorSchemeConfig>;
    public names: ColorSchemeNames;  // Naming convention or dictionary for color names.
    public colorList: ColorSwatch[];  // List of generated ColorSwatch objects.
    public colorDict: Record<string, Record<string, ColorSwatch>>;  // Dictionary organized by hues and color names.

    /**
     * Initializes a new color scheme with the given configuration and naming conventions.
     * @param config Configuration for the color scheme generation; missing
     * fields fall back to the hue.gl defaults.
     * @param names Dictionary for naming colors based on their hue value;
     * hues without a name are keyed by their angle.
     */
    constructor(
        config: ColorSchemeConfig = hueConfig,
        names: ColorSchemeNames = hueNames
    ) {
        this.config = { ...hueConfig, ...config };
        this.names = names;
        this.colorList = [];
        this.colorDict = {};
        this.initializeColors();
    }

    /**
     * Populates `colorList` and `colorDict` with `ColorSwatch` objects based
     * on the current configuration.
     */
    private initializeColors(): void {
        const { prefix, h_step, p_count, l_l_min, l_l_step, l_c_min, l_c_step, d_c_step } = this.config;

        if (!(h_step > 0) || !Number.isInteger(p_count) || p_count < 1) {
            throw new Error("Invalid color scheme configuration: h_step must be > 0 and p_count a positive integer");
        }

        const l_count = Math.ceil(p_count / 2);
        const d_count = Math.floor(p_count / 2);
        const d_c_min = l_c_min + (l_c_step * (l_count - 1));

        // Create LC lists
        // --------------------------------------------------------------------
        // Lightness steps widen by 2 per swatch; this curve defines the
        // published hue.gl palette, so the constants depend on it.
        const l_list: number[] = [];
        const c_list: number[] = [];
        for (let i = 0; i < p_count; i++) {
            l_list.push(l_l_min + l_l_step + i * l_l_step - 2 * i);
        }
        for (let i = 0; i < l_count; i++) {
            c_list.push(l_c_min + i * l_c_step);
        }
        for (let i = 0; i < d_count; i++) {
            c_list.push(d_c_min + d_c_step + i * d_c_step);
        }

        // Create hue.gl
        // --------------------------------------------------------------------
        for (let h = 0; h <= 360; h += h_step) {

            const h_group: Record<string, ColorSwatch> = {};
            const h_group_name = this.names[h] ?? h.toString();

            for (let i = 0; i < p_count; i++) {
                // Hue 0 is the neutral grey ramp
                const c_cur = h === 0 ? 0 : c_list[i];
                const name = prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
                const color = new ColorSwatch(h, c_cur, l_list[i], name);
                this.colorList.push(color);
                h_group[name] = color;
            }

            this.colorDict[h_group_name] = h_group;
        }
    }

    /**
     * Returns the list of all generated color swatches.
     * @returns An array of ColorSwatch objects.
     */
    public getColorList(): ColorSwatch[] {
        return this.colorList;
    }

    /**
     * Returns a dictionary of color swatches organized by hue groups.
     * @returns A dictionary with hue values as keys and another dictionary of
     * ColorSwatch objects as values.
     */
    public getColorDict(): Record<string, Record<string, ColorSwatch>> {
        return this.colorDict;
    }

}
