"use strict";
// script/class/class/DirectoryCleaner.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = void 0;
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
var constants_1 = require("../constants");
// ============================================================================
// Classes
// ============================================================================
class ColorPicker {
    /**
     * Retrieves a color value by its enum key.
     * @param colorEnum The enum type ('RGB' or 'HSL') to pick the color from.
     * @param colorKey The key of the color in the specified enum.
     * @returns The color value or null if the key does not exist in the specified enum.
     */
    static get(colorEnum, colorKey) {
        let color;
        switch (colorEnum) {
            case 'RGB':
                // color = hue_rgb[colorKey as keyof typeof hue_rgb];
                return constants_1.hue_rgb[colorKey] || null;
            // break;
            case 'HCL':
                // color = hue_hcl[colorKey as keyof typeof hue_hcl];
                return constants_1.hue_hcl[colorKey] || null;
            // break;
            case 'HEX':
                // color = hue_hex[colorKey as keyof typeof hue_hex];
                return constants_1.hue_hex[colorKey] || null;
            // break;
            default:
                return null;
        }
        // return color || null;
    }
}
exports.ColorPicker = ColorPicker;
// Usage examples
// const specificRGBColor = ColorPicker.getColor('RGB', 'N0001'); // Should return "rgb(0, 0, 90)" or similar
// console.log(specificRGBColor); // Outputs: rgb(0, 0, 90) or similar
