import { __awaiter } from "tslib";
import path from 'path';
import { DirectoryCleaner, DirectoryCopier, FileCopier, StyleProcessor, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier, StylizedLogger, TemplateWriter, SvgToPngConverter, gl_installer, readPackageJson, } from 'pack.gl';
import ColorScheme from './hue/color/ColorScheme.js';
import hueConfig from "./hue/config/hue.config.js";
import hueNames from "./hue/config/hue.names.js";
const CONFIG = {
    path: {
        src: './src',
        dist: './dist',
        svg_input: './src/svg',
        svg_output: './dist/svg',
        scss_input: './src/scss',
        scss_output: './dist/scss',
        css_output: './dist/css',
        json_output: './dist',
        ts_input: './src/ts',
        ts_output: './dist/ts',
        ts_output_icons: './src/ts/icons',
        js_output: './dist/js',
        jinja_input: './src/jinja',
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logger = new StylizedLogger();
            logger.header('Install .gl libraries');
            yield gl_installer();
            const directoryCleaner = new DirectoryCleaner();
            logger.header('Clean Directories');
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            logger.body(`Directory cleaned: ${CONFIG.path.dist}`);
            const localPackageConfig = yield readPackageJson('./package.json');
            const packageCreator = new PackageCreator(localPackageConfig);
            const packageConfig = packageCreator.config;
            packageCreator.createPackageJson(CONFIG.path.dist);
            logger.header('Color Generation');
            const colorScheme = new ColorScheme(hueConfig, hueNames);
            const color_dict = colorScheme.getColorDict();
            logger.header('Color Writer');
            const template_context = {
                colors: color_dict,
                name: packageConfig["name"],
                version: packageConfig["version"],
                website: packageConfig["homepage"],
            };
            const templater = new TemplateWriter(CONFIG.path.jinja_input, template_context);
            yield templater.generateToFile('hue.gl.code-snippets.jinja', path.join(CONFIG.path.dist, 'code-snippets', 'hue.gl.code-snippets'));
            yield templater.generateToFile('hue.gl.inkscape.jinja', path.join(CONFIG.path.dist, 'inkscape', 'hue.gl.inkscape'));
            yield templater.generateToFile('hue.gl.less.jinja', path.join(CONFIG.path.dist, 'less', 'hue.gl.less'));
            yield templater.generateToFile('hue.gl.md.jinja', path.join(CONFIG.path.dist, 'md', 'hue.gl.md'));
            yield templater.generateToFile('hue.gl.oco.jinja', path.join(CONFIG.path.dist, 'oco', 'hue.gl.oco'));
            yield templater.generateToFile('hue.gl.py.jinja', path.join(CONFIG.path.dist, 'py', 'hue.gl.py'));
            yield templater.generateToFile('hue.gl.rcpx.jinja', path.join(CONFIG.path.dist, 'rcpx', 'hue.gl.rcpx'));
            yield templater.generateToFile('hue.gl.sketchpalette.jinja', path.join(CONFIG.path.dist, 'sketchpalette', 'hue.gl.sketchpalette'));
            yield templater.generateToFile('hue.gl.styl.jinja', path.join(CONFIG.path.dist, 'styl', 'hue.gl.styl'));
            yield templater.generateToFile('hue.gl.tex.jinja', path.join(CONFIG.path.dist, 'tex', 'hue.gl.tex'));
            yield templater.generateToFile('hue.gl.scss.jinja', path.join(CONFIG.path.dist, 'scss', 'hue.gl.scss'));
            yield templater.generateToFile('hue.gl.d.ts.jinja', path.join(CONFIG.path.dist, 'ts', 'hue.gl.d.ts'));
            yield templater.generateToFile('hue.gl.css.jinja', path.join(CONFIG.path.dist, 'css', 'hue.gl.css'));
            yield templater.generateToFile('hue.gl.js.jinja', path.join(CONFIG.path.dist, 'js', 'hue.gl.js'));
            for (const groupName in color_dict) {
                if (color_dict.hasOwnProperty(groupName)) {
                    console.log(`Group: ${groupName}`);
                    for (const colorName in color_dict[groupName]) {
                        if (color_dict[groupName].hasOwnProperty(colorName)) {
                            const colorSwatch = color_dict[groupName][colorName];
                            console.log(`Color Name: ${colorName}`);
                            const svg_template_context = { color: colorSwatch, };
                            const svg_templater = new TemplateWriter(CONFIG.path.jinja_input, svg_template_context);
                            let svg_output_path = path.join(CONFIG.path.dist, 'svg', 'swatch', `${colorName}.svg`);
                            yield svg_templater.generateToFile('square.svg.jinja', svg_output_path);
                            const converter = new SvgToPngConverter();
                            const svgContent = yield svg_templater.generateTemplate('square.svg.jinja');
                            let png_output_path = path.join(CONFIG.path.dist, 'png', 'swatch', `${colorName}.png`);
                            yield converter.convert(svgContent, png_output_path, 500, 500)
                                .then(() => console.log('Conversion successful'))
                                .catch(error => console.error('Conversion failed:', error));
                        }
                    }
                }
            }
            const styleProcessor = new StyleProcessor();
            logger.header('Processing SASS...');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `${packageConfig.name}.css`), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `${packageConfig.name}.min.css`), 'compressed');
            logger.body('SASS Processing completed.');
            const directoryCopier = new DirectoryCopier();
            yield directoryCopier.recursiveCopy(CONFIG.path.ts_input, CONFIG.path.ts_output);
            yield directoryCopier.recursiveCopy(CONFIG.path.scss_input, CONFIG.path.scss_output);
            const fileCopier = new FileCopier();
            fileCopier.copyFileToDirectory(path.join('.', 'README.md'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE-CODE'), CONFIG.path.dist);
            const versionWriter = new VersionWriter();
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            const tsCompiler = new TypeScriptCompiler();
            const tsFiles = [
                path.join(CONFIG.path.ts_input, 'index.ts'),
            ];
            const outputDir = './dist/js';
            yield tsCompiler.compile(tsFiles, outputDir);
            const jsMinifier = new JavaScriptMinifier();
            yield jsMinifier.minifyFile(path.join(CONFIG.path.js_output, 'index.js'), path.join(CONFIG.path.js_output, `${packageConfig.name}.min.js`))
                .then(() => console.log('JavaScript minification completed.'))
                .catch(console.error);
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map