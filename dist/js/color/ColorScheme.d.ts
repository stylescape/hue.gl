import { ColorSwatch } from './ColorSwatch.js';
/**
 * Configuration for generating a color scheme, including steps and bounds for
 * color values.
 */
type ColorSchemeConfig = {
    prefix?: string;
    h_step?: number;
    p_count?: number;
    l_l_min?: number;
    l_l_step?: number;
    d_l_step?: number;
    l_c_min?: number;
    l_c_step?: number;
    d_c_step?: number;
};
/**
 * A class for creating a customizable color scheme based on provided
 * configurations.
 */
export declare class ColorScheme {
    config: ColorSchemeConfig | any;
    names: any;
    colorList: ColorSwatch[];
    colorDict: Record<string, Record<string, ColorSwatch>>;
    /**
     * Initializes a new color scheme with the given configuration and naming conventions.
     * @param config Configuration for the color scheme generation.
     * @param names Dictionary for naming colors based on their hue value.
     */
    constructor(config: ColorSchemeConfig, names: any);
    /**
     * Populates `colorList` and `colorDict` with `ColorSwatch` objects based
     * on the current configuration.
     */
    private initializeColors;
    /**
     * Returns the list of all generated color swatches.
     * @returns An array of ColorSwatch objects.
     */
    getColorList(): ColorSwatch[];
    /**
     * Returns a dictionary of color swatches organized by hue groups.
     * @returns A dictionary with hue values as keys and another dictionary of
     * ColorSwatch objects as values.
     */
    getColorDict(): Record<string, Record<string, ColorSwatch>>;
}
export {};
