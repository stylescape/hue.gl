type ColorEnum = 'RGB' | 'HSL' | 'HCL' | 'HEX';
export declare class ColorPicker {
    /**
     * Retrieves a color value by its enum key.
     * @param colorEnum The enum type ('RGB' or 'HSL') to pick the color from.
     * @param colorKey The key of the color in the specified enum.
     * @returns The color value or null if the key does not exist in the specified enum.
     */
    static get(colorEnum: ColorEnum, colorKey: string): string | null;
}
export {};
