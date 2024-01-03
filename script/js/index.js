import { __awaiter } from "tslib";
import path from 'path';
import { DirectoryCleaner, DirectoryCopier, DirectoryCreator, FileRenamer, StyleProcessor, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier } from 'pack.gl';
import ColorScheme from './hue/color/ColorScheme.js';
import TemplateWriter from './hue/writers/TemplateWriter.js';
import { CONFIG } from './config/config.js';
import packageConfig from "./config/package.config.js";
import tsConfig from "./config/ts.config.js";
import tensorConfig from "./config/terser.config.js";
import hueConfig from "./hue/config/hue.config.js";
import hueNames from "./hue/config/hue.names.js";
const directories = Object.values(CONFIG.path);
const tsCompiler = new TypeScriptCompiler(tsConfig);
const jsMinifier = new JavaScriptMinifier(tensorConfig);
const packageCreator = new PackageCreator(packageConfig);
const styleProcessor = new StyleProcessor();
const versionWriter = new VersionWriter();
const fileRenamer = new FileRenamer();
const directoryCopier = new DirectoryCopier();
const directoryCleaner = new DirectoryCleaner();
const directoryCreator = new DirectoryCreator();
const colorScheme = new ColorScheme(hueConfig, hueNames);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            yield directoryCreator.createDirectories('.', directories);
            const color_list = colorScheme.getColorList();
            const color_dict = colorScheme.getColorDict();
            console.log(color_dict);
            const templater = new TemplateWriter(packageConfig, color_dict, CONFIG.path.jinja_input);
            yield templater.generateToFile('hue.gl.code-snippets.jinja', path.join(CONFIG.path.dist, 'hue.gl.code-snippets'));
            yield templater.generateToFile('hue.gl.css.jinja', path.join(CONFIG.path.dist, 'hue.gl.css'));
            yield templater.generateToFile('hue.gl.d.ts.jinja', path.join(CONFIG.path.dist, 'hue.gl.d.ts'));
            yield templater.generateToFile('hue.gl.inkscape.jinja', path.join(CONFIG.path.dist, 'hue.gl.inkscape'));
            yield templater.generateToFile('hue.gl.js.jinja', path.join(CONFIG.path.dist, 'hue.gl.js'));
            yield templater.generateToFile('hue.gl.less.jinja', path.join(CONFIG.path.dist, 'hue.gl.less'));
            yield templater.generateToFile('hue.gl.oco.jinja', path.join(CONFIG.path.dist, 'hue.gl.oco'));
            yield templater.generateToFile('hue.gl.py.jinja', path.join(CONFIG.path.dist, 'hue.gl.py'));
            yield templater.generateToFile('hue.gl.rcpx.jinja', path.join(CONFIG.path.dist, 'hue.gl.rcpx'));
            yield templater.generateToFile('hue.gl.scss.jinja', path.join(CONFIG.path.dist, 'hue.gl.scss'));
            yield templater.generateToFile('hue.gl.sketchpalette.jinja', path.join(CONFIG.path.dist, 'hue.gl.sketchpalette'));
            yield templater.generateToFile('hue.gl.styl.jinja', path.join(CONFIG.path.dist, 'hue.gl.styl'));
            yield templater.generateToFile('hue.gl.svg.jinja', path.join(CONFIG.path.dist, 'hue.gl.svg'));
            yield templater.generateToFile('hue.gl.tex.jinja', path.join(CONFIG.path.dist, 'hue.gl.tex'));
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, 'hue.gl.css'), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, 'hue.gl.min.css'), 'compressed');
            try {
                yield directoryCopier.copyFiles(CONFIG.path.ts_input, CONFIG.path.ts_output);
            }
            catch (error) {
            }
            try {
                yield directoryCopier.copyFiles(CONFIG.path.scss_input, CONFIG.path.scss_output);
            }
            catch (error) {
            }
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            yield packageCreator.createPackageJson(CONFIG.path.dist);
            try {
                const tsFiles = [
                    path.join(CONFIG.path.ts_input, 'index.ts'),
                ];
                const outputDir = './dist/js';
                tsCompiler.compile(tsFiles, outputDir);
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
            yield fileRenamer.renameFile(path.join(CONFIG.path.js_output, 'index.js'), path.join(CONFIG.path.js_output, 'hue.gl.js'));
            yield jsMinifier.minifyFile(path.join(CONFIG.path.js_output, 'hue.gl.js'), path.join(CONFIG.path.js_output, 'hue.gl.min.js'))
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