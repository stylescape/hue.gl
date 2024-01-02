// script/class/class/DirectoryCleaner.ts

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

import fs from 'fs/promises'; // Use fs promises for async operations
import nunjucks from 'nunjucks';
import Color from '../color/ColorSwatch';
import path from 'path';
import BaseWriter from './BaseWriter.js';
import { PackageJson, ColorScheme } from '../types';
// import ase from 'ase-utils';


// ============================================================================
// Classes
// ============================================================================

class ASEWriter extends BaseWriter {

    private aseColors: any; // Define a more specific type if possible

    /**
     * Constructs a ASEWriter instance.
     * @param {PackageJson} packageJson - The content to be written into package.json.
     * @param colors - Color objects.
     */
     constructor(
        packageJson: PackageJson,
        colors: ColorScheme,
    ) {
        super(packageJson, colors);

        // const inputColors = this.formatColorsForASE(colors);
        // this.aseColors = {
        //     version: '1.0',
        //     groups: [],
        //     colors: inputColors
        // };
    };

    // private formatColorsForASE(colors: ColorScheme): any[] {
    //     // Refactor this method to format the colors
    //     return Object.keys(colors)
    //         .filter(name => typeof colors[name] !== 'string')
    //         .map(name => colors[name].map((hex, index) => ({
    //             "name": `${name} 0${index} ${hex.toUpperCase()}`,
    //             "model": "RGB",
    //             "color": `${colors[name].srgb.coords[0]}`,
    //             "type": "global"
    //         })))
    //         .reduce((a, b) => a.concat(b), []);
    // }

    // async write(file: string, outputPaths: string[]): Promise<void> {
    //     try {
    //         const buffer = ase.encode(this.aseColors); // Ensure `ase.encode` is defined

    //         for (const outputPath of outputPaths) {
    //             await fs.writeFile(path.join(outputPath, file), buffer);
    //         }
    //     } catch (error) {
    //         console.error(`Error writing ASE file: ${error}`);
    //         throw error;
    //     }
    // }


}


// ============================================================================
// Export
// ============================================================================

export default ASEWriter;
