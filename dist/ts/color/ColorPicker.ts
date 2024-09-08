// script/class/class/DirectoryCleaner.ts

// Copyright 2024 Scape Agency BV

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

import {
    hue_hex,
    hue_hcl,
    hue_rgb,
} from '../constants';


// ============================================================================
// Types
// ============================================================================

/**
 * Enumerates the types of color models that are supported by the ColorPicker.
 */
type ColorEnum = 'RGB' | 'HSL' | 'HCL' | 'HEX';


// ============================================================================
// Classes
// ============================================================================

/**
 * Provides functionality to fetch color values based on a specified color model and key.
 */
export class ColorPicker {

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
     static get(colorEnum: ColorEnum, colorKey: string): string | null {
        let color: string | undefined;

        switch (colorEnum) {
            case 'RGB':
                // color = hue_rgb[colorKey as keyof typeof hue_rgb];
                return hue_rgb[colorKey as keyof typeof hue_rgb] || null;
                // break;
            case 'HCL':
                // color = hue_hcl[colorKey as keyof typeof hue_hcl];
                return hue_hcl[colorKey as keyof typeof hue_hcl] || null;
                // break;
            case 'HEX':
                // color = hue_hex[colorKey as keyof typeof hue_hex];
                return hue_hex[colorKey as keyof typeof hue_hex] || null;
                // break;
            default:
                return null;
        }

        // return color || null;
    }

}


// ============================================================================
// Example
// ============================================================================


/**
 * Example demonstrating how to retrieve a specific RGB color using the ColorPicker.
 */
//  const specificRGBColor = ColorPicker.get('RGB', 'N0001'); // Should return "rgb(0, 0, 90)" or similar
//  console.log(specificRGBColor); // Outputs: rgb(0, 0, 90) or similar