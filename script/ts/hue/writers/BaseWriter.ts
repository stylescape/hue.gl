// hue/writers/BaseWriter.ts

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

import fs from 'fs/promises';
import path from 'path';
import Color from '../color/ColorSwatch';
import { PackageJson, ColorScheme, BuildFileContent, OutputPaths } from '../types';


// ============================================================================
// Classes
// ============================================================================

class BaseWriter{

    public packageJson: PackageJson;
    public colors: ColorScheme;
    
    /**
     * Constructs a BaseWriter instance.
     * @param packageJson - The content to be written into package.json.
     * @param colors - Color objects organized in a structured format.
     */
     constructor(
        packageJson: PackageJson,
        colors: ColorScheme,
    ) {
        this.packageJson = packageJson;
        this.colors = colors;
    }

    // build(file: any, outputPaths: any, extraData = {}){

    // }

    // /**
    //  * Builds and writes data to files.
    //  * @param fileContent - The content to be written.
    //  * @param outputPaths - Paths where the content should be written.
    //  * @param extraData - Additional data that might be used in building the file.
    //  */
    //  async write(
    //     fileContent: BuildFileContent, 
    //     outputPaths: OutputPaths, 
    //     extraData: Record<string, any> = {}
    // ) {
    //     // Implement the logic for building and writing the files
    //     // Example:
    //     try {
    //         for (const outputPath of outputPaths) {
    //             const fullPath = path.resolve(outputPath);
    //             await fs.writeFile(fullPath, JSON.stringify(fileContent), 'utf-8');
    //             // Handle extraData if needed
    //         }
    //     } catch (error) {
    //         console.error(`Error writing to files: ${error}`);
    //         // throw error;
    //         throw new Error('File writing failed');

    //     }
    // }

}


// ============================================================================
// Export
// ============================================================================

export default BaseWriter;
