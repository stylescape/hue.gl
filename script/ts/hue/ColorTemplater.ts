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
import Color from './ColorSwatch'; // Assuming this is the path to your Color class
import path from 'path';

// ============================================================================
// Classes
// ============================================================================

class ColorTemplater {

    private packageJson: any;
    private colors: Record<string, Record<string, Color>>;

    /**
     * Constructs a ColorTemplater instance.
     * @param {any} packageJson - The content to be written into package.json.
     * @param colors - Color objects.
     * @param templatesDir - Directory for Nunjucks templates.
     * @param enableCache - Enable or disable caching for Nunjucks.
     */
     constructor(
        packageJson: any,
        colors: Record<string, Record<string, Color>>,
        templatesDir: string,
        enableCache: boolean = false
    ) {
        this.packageJson = packageJson;
        this.colors = colors;
        nunjucks.configure(templatesDir, { 
            autoescape: true,
            noCache: !enableCache
        });
    }

    /**
     * Formats the colors for the template.
     * @returns Array of color records.
     */
    //  formatColorsForTemplate(): Record<string, string>[] {
    //     return this.colors.map(color => ({
    //         name: color.getName() ?? 'unnamed',
    //         color: color.toString()
    //     }));
    // }

    /**
     * Generates a template using the provided template file.
     * @param template - The template file name.
     * @returns The rendered template as a string.
     */
         async generateTemplate(template: string): Promise<string> {
            try {
                // const formattedColors = this.formatColorsForTemplate();
                // return nunjucks.render(template, { colors: formattedColors });
                return nunjucks.render(
                    template,
                    {
                        colors: this.colors,
                        name: this.packageJson["name"],
                        version: this.packageJson["version"],
                        website: this.packageJson["homepage"],
                    }
                );

            } catch (error) {
                console.error(`Error generating template: ${error}`);
                throw error;
            }
        }

    /**
     * Writes the rendered template content to a file.
     * @param template - The template file name.
     * @param outputFile - The output file path.
     */
    async generateToFile(template: string, outputFile: string): Promise<void> {
        try {
            const content = await this.generateTemplate(template);
            await fs.writeFile(outputFile, content, 'utf-8');
        } catch (error) {
            console.error(`Error writing to file: ${error}`);
            throw error;
        }
    }

}


// ============================================================================
// Export
// ============================================================================

export default ColorTemplater;
