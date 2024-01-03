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

import {
    DirectoryCleaner,
    DirectoryCopier,
    FileCopier,
    StyleProcessor,
    PackageCreator,
    VersionWriter,
    TypeScriptCompiler,
    JavaScriptMinifier,
    StylizedLogger,
    TemplateWriter,
    SvgToPngConverter,
    gl_installer,
    readPackageJson,
} from 'pack.gl';

import ColorScheme from './hue/color/ColorScheme.js';
import hueConfig from "./hue/config/hue.config.js"
import hueNames from "./hue/config/hue.names.js"


// ============================================================================
// Constants
// ============================================================================

// Initialize instances of necessary classes
const CONFIG = {
    path: {
        src:                './src',
        dist:               './dist',
        svg_input:          './src/svg',
        svg_output:         './dist/svg',
        scss_input:         './src/scss',
        scss_output:        './dist/scss',
        css_output:         './dist/css',
        json_output:        './dist',
        ts_input:           './src/ts',
        ts_output:          './dist/ts',
        ts_output_icons:    './src/ts/icons',
        js_output:          './dist/js',
        jinja_input:        './src/jinja',
        // jinja_output:         './dist/js',
    },
};


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

        // Init Logger
        // --------------------------------------------------------------------

        const logger = new StylizedLogger();


        // Install .gl libraries
        // --------------------------------------------------------------------

        logger.header('Install .gl libraries');
        await gl_installer();


        // Dirs Clean
        // --------------------------------------------------------------------

        const directoryCleaner = new DirectoryCleaner();
        logger.header('Clean Directories');
        directoryCleaner.cleanDirectory(CONFIG.path.dist);
        logger.body(`Directory cleaned: ${CONFIG.path.dist}`);


        // Package JSON
        // --------------------------------------------------------------------

        const localPackageConfig = await readPackageJson('./package.json');
        const packageCreator = new PackageCreator(localPackageConfig);
        const packageConfig = packageCreator.config
        packageCreator.createPackageJson(CONFIG.path.dist);


        // Color Generation
        // --------------------------------------------------------------------

        logger.header('Color Generation');
        const colorScheme = new ColorScheme(hueConfig, hueNames);
        const color_dict = colorScheme.getColorDict();
        // console.log(color_dict);


        // Color Writer
        // --------------------------------------------------------------------

        logger.header('Color Writer');
        const template_context = {
            colors: color_dict,
            name: packageConfig["name"],
            version: packageConfig["version"],
            website: packageConfig["homepage"],
        }
        const templater = new TemplateWriter(CONFIG.path.jinja_input, template_context);
        await templater.generateToFile('hue.gl.code-snippets.jinja',  path.join(CONFIG.path.dist, 'code-snippets',  'hue.gl.code-snippets'));
        await templater.generateToFile('hue.gl.inkscape.jinja',       path.join(CONFIG.path.dist, 'inkscape',       'hue.gl.inkscape'));
        await templater.generateToFile('hue.gl.less.jinja',           path.join(CONFIG.path.dist, 'less',           'hue.gl.less'));
        await templater.generateToFile('hue.gl.md.jinja',             path.join(CONFIG.path.dist, 'md',             'hue.gl.md'));
        await templater.generateToFile('hue.gl.oco.jinja',            path.join(CONFIG.path.dist, 'oco',            'hue.gl.oco'));
        await templater.generateToFile('hue.gl.py.jinja',             path.join(CONFIG.path.dist, 'py',             'hue.gl.py'));
        await templater.generateToFile('hue.gl.rcpx.jinja',           path.join(CONFIG.path.dist, 'rcpx',           'hue.gl.rcpx'));
        await templater.generateToFile('hue.gl.sketchpalette.jinja',  path.join(CONFIG.path.dist, 'sketchpalette',  'hue.gl.sketchpalette'));
        await templater.generateToFile('hue.gl.styl.jinja',           path.join(CONFIG.path.dist, 'styl',           'hue.gl.styl'));
        await templater.generateToFile('hue.gl.tex.jinja',            path.join(CONFIG.path.dist, 'tex',            'hue.gl.tex'));

        await templater.generateToFile('hue.gl.scss.jinja',           path.join(CONFIG.path.dist, 'scss',           'hue.gl.scss'));
        await templater.generateToFile('hue.gl.d.ts.jinja',           path.join(CONFIG.path.dist, 'ts',             'hue.gl.d.ts'));

        await templater.generateToFile('hue.gl.css.jinja',            path.join(CONFIG.path.dist, 'css',            'hue.gl.css'));
        await templater.generateToFile('hue.gl.js.jinja',             path.join(CONFIG.path.dist, 'js',             'hue.gl.js'));
        // await templater.generateToFile('hue.gl.svg.jinja',            path.join(CONFIG.path.dist, 'svg',            'hue.gl.svg'));


        // Create Swatches
        // --------------------------------------------------------------------

        for (const groupName in color_dict) {
            if (color_dict.hasOwnProperty(groupName)) {
                console.log(`Group: ${groupName}`);

                // Looping over each color swatch in the group
                for (const colorName in color_dict[groupName]) {
                    if (color_dict[groupName].hasOwnProperty(colorName)) {
                        const colorSwatch = color_dict[groupName][colorName];
                        
                        // Process each color swatch here
                        console.log(`Color Name: ${colorName}`);

                        const svg_template_context = {color: colorSwatch,}
                        const svg_templater = new TemplateWriter(CONFIG.path.jinja_input, svg_template_context);
                        let svg_output_path = path.join(CONFIG.path.dist, 'svg', 'swatch',`${colorName}.svg`)
                        await svg_templater.generateToFile('square.svg.jinja', svg_output_path);

                        const converter = new SvgToPngConverter();
                        const svgContent = await svg_templater.generateTemplate('square.svg.jinja');
                        let png_output_path = path.join(CONFIG.path.dist, 'png', 'swatch',`${colorName}.png`)
                        await converter.convert(svgContent, png_output_path, 500, 500)
                            .then(() => console.log('Conversion successful'))
                            .catch(error => console.error('Conversion failed:', error));
                    }
                }
            }
        }


        // SASS
        // --------------------------------------------------------------------

        const styleProcessor = new StyleProcessor();
        logger.header('Processing SASS...');
        // Process with expanded style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            path.join(CONFIG.path.css_output, `${packageConfig.name}.css`),
            'expanded'
        );
        // Process with compressed style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            path.join(CONFIG.path.css_output, `${packageConfig.name}.min.css`),
            'compressed'
        );
        logger.body('SASS Processing completed.');


        // Copy Directories
        // --------------------------------------------------------------------

        const directoryCopier = new DirectoryCopier();
        await directoryCopier.copyFiles(
            CONFIG.path.ts_input,
            CONFIG.path.ts_output,
        );
        await directoryCopier.copyFiles(
            CONFIG.path.scss_input,
            CONFIG.path.scss_output,
        );


        // Copy files
        // --------------------------------------------------------------------

        const fileCopier = new FileCopier();
        fileCopier.copyFileToDirectory(
            path.join('.', 'README.md'),
            CONFIG.path.dist,
        )
        fileCopier.copyFileToDirectory(
            path.join('.', 'LICENSE'),
            CONFIG.path.dist,
        )
        fileCopier.copyFileToDirectory(
            path.join('.', 'LICENSE-CODE'),
            CONFIG.path.dist,
        )


        // Version
        // --------------------------------------------------------------------

        const versionWriter = new VersionWriter();
        await versionWriter.writeVersionToFile('VERSION', packageConfig.version);


        // Compile TypeScript to JavaScript
        // --------------------------------------------------------------------
        const tsCompiler = new TypeScriptCompiler();
        const tsFiles = [
            path.join(CONFIG.path.ts_input, 'index.ts'),
        ];
        const outputDir = './dist/js';
        // console.log('Starting TypeScript compilation...');
        await tsCompiler.compile(tsFiles, outputDir);
        // console.log('TypeScript compilation completed.');
    

        // Rename Ts
        // --------------------------------------------------------------------

        // await fileRenamer.renameFile(
        //     path.join(CONFIG.path.js_output, 'index.js'),
        //     path.join(CONFIG.path.js_output, `${packageConfig.name}.js`),
        // )


        // Minify JavaScript
        // --------------------------------------------------------------------
        const jsMinifier = new JavaScriptMinifier();
        await jsMinifier.minifyFile(
            path.join(CONFIG.path.js_output, 'index.js'),
            path.join(CONFIG.path.js_output, `${packageConfig.name}.min.js`),
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
