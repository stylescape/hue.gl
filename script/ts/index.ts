// script/index.ts

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

// Import necessary modules and classes
import path from 'path';
import FontGenerator from './class/FontGenerator.js';
import SvgPackager from "./class/SvgPackager.js";
import StyleProcessor from "./class/StyleProcessor.js";
import SvgSpriteGenerator from "./class/SvgSpriteGenerator.js";
import PackageCreator from './class/PackageCreator.js';
import VersionWriter from './class/VersionWriter.js';
import FileCopier from './class/FileCopier.js'; 
import FileRenamer from './class/FileRenamer.js'; 
import DirectoryCreator from './class/DirectoryCreator.js';
import DirectoryCopier from './class/DirectoryCopier.js';
import DirectoryCleaner from './class/DirectoryCleaner.js'; // Adjust the path as needed
import TypeScriptCompiler from './class/TypeScriptCompiler.js';
import JavaScriptMinifier from './class/JavaScriptMinifier.js';
import ColorScheme from './hue/ColorScheme.js';
import ColorTemplater from './hue/ColorTemplater.js';

// Import necessary configurations
import { CONFIG } from './config/config.js';
import svgspriteConfig from "./config/svgsprite.config.js";
import packageConfig from "./config/package.config.js"
import tsConfig from "./config/ts.config.js"
import tensorConfig from "./config/terser.config.js"
import hueConfig from "./hue/hue.config.js"
import hueNames from "./hue/hue.names.js"


// ============================================================================
// Constants
// ============================================================================

// Initialize instances of necessary classes
const directories = Object.values(CONFIG.path);
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const tsCompiler = new TypeScriptCompiler(tsConfig);
const jsMinifier = new JavaScriptMinifier(tensorConfig);
const packageCreator = new PackageCreator(packageConfig);
const svgPackager = new SvgPackager();
const fontGenerator = new FontGenerator();
const styleProcessor = new StyleProcessor();
const versionWriter = new VersionWriter();
const fileCopier = new FileCopier();
const fileRenamer = new FileRenamer();
const directoryCopier = new DirectoryCopier();
const directoryCleaner = new DirectoryCleaner();
const directoryCreator = new DirectoryCreator();

const colorScheme = new ColorScheme(hueConfig, hueNames);


// ============================================================================
// Functions
// ============================================================================

/**
 * Main function to orchestrate the various processes.
 * It handles SVG processing, font generation, SVG sprite generation, and SASS
 * processing.
 */
async function main() {

    try {

        const color_list = colorScheme.getColorList();
        const color_dict = colorScheme.getColorDict();
        console.log(color_dict);

        // const templater = new ColorTemplater(color_list, "../jinja");
        const templater = new ColorTemplater(packageConfig, color_dict, CONFIG.path.jinja_input);
        templater.generateToFile('hue.gl.code-snippets.jinja',  path.join(CONFIG.path.dist, 'hue.gl.code-snippets'));
        templater.generateToFile('hue.gl.css.jinja',            path.join(CONFIG.path.dist, 'hue.gl.css'));
        templater.generateToFile('hue.gl.d.ts.jinja',           path.join(CONFIG.path.dist, 'hue.gl.d.ts'));
        templater.generateToFile('hue.gl.inkscape.jinja',       path.join(CONFIG.path.dist, 'hue.gl.inkscape'));
        templater.generateToFile('hue.gl.js.jinja',             path.join(CONFIG.path.dist, 'hue.gl.js'));
        templater.generateToFile('hue.gl.less.jinja',           path.join(CONFIG.path.dist, 'hue.gl.less'));
        templater.generateToFile('hue.gl.oco.jinja',            path.join(CONFIG.path.dist, 'hue.gl.oco'));
        templater.generateToFile('hue.gl.py.jinja',             path.join(CONFIG.path.dist, 'hue.gl.py'));
        templater.generateToFile('hue.gl.rcpx.jinja',           path.join(CONFIG.path.dist, 'hue.gl.rcpx'));
        templater.generateToFile('hue.gl.scss.jinja',           path.join(CONFIG.path.dist, 'hue.gl.scss'));
        templater.generateToFile('hue.gl.sketchpalette.jinja',  path.join(CONFIG.path.dist, 'hue.gl.sketchpalette'));
        templater.generateToFile('hue.gl.styl.jinja',           path.join(CONFIG.path.dist, 'hue.gl.styl'));
        templater.generateToFile('hue.gl.svg.jinja',            path.join(CONFIG.path.dist, 'hue.gl.svg'));
        templater.generateToFile('hue.gl.tex.jinja',            path.join(CONFIG.path.dist, 'hue.gl.tex'));

        

        // Dirs Clean
        // --------------------------------------------------------------------
        directoryCleaner.cleanDirectory(CONFIG.path.dist);
        // console.log(`Directory cleaned: ${CONFIG.path.dist}`);

        // Dirs Create
        // --------------------------------------------------------------------
        // console.log('Starting Directory creation...');
        // Assuming the base path is the current directory
        await directoryCreator.createDirectories('.', directories);


        // SASS
        // --------------------------------------------------------------------
        // console.log('Processing SASS...');
        // Process with expanded style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            path.join(CONFIG.path.css_output, 'hue.gl.css'),
            'expanded'
        );
        // Process with compressed style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            path.join(CONFIG.path.css_output, 'hue.gl.min.css'),
            'compressed'
        );
        // console.log('SASS Processing completed.');


        // Copy Files
        // --------------------------------------------------------------------

        // Define the source file and destination directory
        // const srcFile = './path/to/source/file.txt';
        // const destDir = './path/to/destination/directory';

        // // Copy the file
        // try {
        //     await fileCopier.copyFileToDirectory(srcFile, destDir);
        //     console.log('File copying completed successfully.');
        // } catch (error) {
        //     console.error('Error while copying file:', error);
        // }


        // Copy Dirs
        // --------------------------------------------------------------------
        try {
            await directoryCopier.copyFiles(
                CONFIG.path.ts_input,
                CONFIG.path.ts_output,
            );
            // console.log('Files copied successfully.');
        } catch (error) {
            // console.error('Error while copying files:', error);
        }
        try {
            await directoryCopier.copyFiles(
                CONFIG.path.scss_input,
                CONFIG.path.scss_output,
            );
            // console.log('Files copied successfully.');
        } catch (error) {
            // console.error('Error while copying files:', error);
        }

        // Version
        // --------------------------------------------------------------------
        await versionWriter.writeVersionToFile('VERSION', packageConfig.version);


        // Package JSON
        // --------------------------------------------------------------------

        await packageCreator.createPackageJson(CONFIG.path.dist);


        // Compile TypeScript to JavaScript
        // --------------------------------------------------------------------


        try {
    
            // TypeScript compilation
            const tsFiles = [
                path.join(CONFIG.path.ts_input, 'index.ts'),
                // './src/ts/index.ts',
                // './src/ts/file1.ts',
                // './src/ts/file2.ts'
            ]; // Replace with actual file paths
            const outputDir = './dist/js';
            
            // console.log('Starting TypeScript compilation...');
            tsCompiler.compile(tsFiles, outputDir);
            // console.log('TypeScript compilation completed.');
    
        } catch (error) {
            console.error('An error occurred:', error);
        }


        // Rename Ts
        // --------------------------------------------------------------------

        await fileRenamer.renameFile(
            path.join(CONFIG.path.js_output, 'index.js'),
            path.join(CONFIG.path.js_output, 'hue.gl.js'),
        )

        // Minify JavaScript
        // --------------------------------------------------------------------

        await jsMinifier.minifyFile(
            path.join(CONFIG.path.js_output, 'hue.gl.js'),
            path.join(CONFIG.path.js_output, 'hue.gl.min.js'),
            // inputJsFile,
            // outputMinJsFile
        )
        .then(() => console.log('JavaScript minification completed.'))
        .catch(console.error);


        

    } catch (error) {
        console.error('An error occurred:', error);
    }

}


// ============================================================================
// Main
// ============================================================================

// Execute the main function
main();
