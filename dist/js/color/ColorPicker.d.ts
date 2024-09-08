/**
 * Enumerates the types of color models that are supported by the ColorPicker.
 */
type ColorEnum = 'RGB' | 'HSL' | 'HCL' | 'HEX';
/**
 * Provides functionality to fetch color values based on a specified color model and key.
 */
export declare class ColorPicker {
    /**
     * Retrieves a color value by its enum key.
     *
     * This method allows for fetching a color value using a defined enum type
     * and a key specific to that enum's color model. The method supports various color models
     * such as RGB, HCL, and HEX.
     *
     * @param colorEnum The enum type to pick the color from. Possible values are 'RGB', 'HSL', 'HCL', 'HEX'.
     * @param colorKey The key of the color in the specified enum. This is expected to be a valid key within the respective color dictionary.
     * @returns The color value as a string (if found), or null if the key does not exist in the specified enum.
     */
    static get(colorEnum: ColorEnum, colorKey: string): string | null;
}
export {};
/**
 * Example demonstrating how to retrieve a specific RGB color using the ColorPicker.
 */
