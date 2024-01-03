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

// import fs from 'fs/promises'; // Use fs promises for async operations
// import nunjucks from 'nunjucks';
// import Color from '../color/ColorSwatch';
// import path from 'path';
// import BaseWriter from './BaseWriter.js';
// import { PackageJson, ColorScheme } from '../types';

import fs from 'fs/promises';
import nunjucks from 'nunjucks';
import path from 'path';
import BaseWriter from './BaseWriter.js';
import { PackageJson, ColorScheme } from '../types';

// ============================================================================
// Classes
// ============================================================================

class TemplateWriter extends BaseWriter {

    /**
     * Constructs a TemplateWriter instance.
     * @param {any} packageJson - The content to be written into package.json.
     * @param colors - Color objects.
     * @param templatesDir - Directory for Nunjucks templates.
     * @param enableCache - Enable or disable caching for Nunjucks.
     */
     constructor(
        packageJson: PackageJson,
        colors: ColorScheme,
        templatesDir: string,
        enableCache: boolean = false
    ) {
        // this.packageJson = packageJson;
        // this.colors = colors;
        super(packageJson, colors);
        nunjucks.configure(templatesDir, { 
            autoescape: true,
            noCache: !enableCache
        });
    }

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
            // throw error;
            throw new Error('Template generation failed');

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
                const dir = path.dirname(outputFile);
    
                // Check if the directory exists, and create it if it does not
                await fs.mkdir(dir, { recursive: true });
    
                // Write the file
                await fs.writeFile(outputFile, content, 'utf-8');
            } catch (error) {
                console.error(`Error writing to file: ${error}`);
                throw new Error('File writing failed');
            }
        }

}


// ============================================================================
// Export
// ============================================================================

export default TemplateWriter;
