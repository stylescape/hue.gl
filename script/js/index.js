import { __awaiter } from "tslib";
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
import DirectoryCleaner from './class/DirectoryCleaner.js';
import TypeScriptCompiler from './class/TypeScriptCompiler.js';
import JavaScriptMinifier from './class/JavaScriptMinifier.js';
import ColorScheme from './hue/color/ColorScheme.js';
import TemplateWriter from './hue/writers/TemplateWriter.js';
import { CONFIG } from './config/config.js';
import svgspriteConfig from "./config/svgsprite.config.js";
import packageConfig from "./config/package.config.js";
import tsConfig from "./config/ts.config.js";
import tensorConfig from "./config/terser.config.js";
import hueConfig from "./hue/config/hue.config.js";
import hueNames from "./hue/config/hue.names.js";
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const color_list = colorScheme.getColorList();
            const color_dict = colorScheme.getColorDict();
            console.log(color_dict);
            const templater = new TemplateWriter(packageConfig, color_dict, CONFIG.path.jinja_input);
            templater.generateToFile('hue.gl.code-snippets.jinja', path.join(CONFIG.path.dist, 'hue.gl.code-snippets'));
            templater.generateToFile('hue.gl.css.jinja', path.join(CONFIG.path.dist, 'hue.gl.css'));
            templater.generateToFile('hue.gl.d.ts.jinja', path.join(CONFIG.path.dist, 'hue.gl.d.ts'));
            templater.generateToFile('hue.gl.inkscape.jinja', path.join(CONFIG.path.dist, 'hue.gl.inkscape'));
            templater.generateToFile('hue.gl.js.jinja', path.join(CONFIG.path.dist, 'hue.gl.js'));
            templater.generateToFile('hue.gl.less.jinja', path.join(CONFIG.path.dist, 'hue.gl.less'));
            templater.generateToFile('hue.gl.oco.jinja', path.join(CONFIG.path.dist, 'hue.gl.oco'));
            templater.generateToFile('hue.gl.py.jinja', path.join(CONFIG.path.dist, 'hue.gl.py'));
            templater.generateToFile('hue.gl.rcpx.jinja', path.join(CONFIG.path.dist, 'hue.gl.rcpx'));
            templater.generateToFile('hue.gl.scss.jinja', path.join(CONFIG.path.dist, 'hue.gl.scss'));
            templater.generateToFile('hue.gl.sketchpalette.jinja', path.join(CONFIG.path.dist, 'hue.gl.sketchpalette'));
            templater.generateToFile('hue.gl.styl.jinja', path.join(CONFIG.path.dist, 'hue.gl.styl'));
            templater.generateToFile('hue.gl.svg.jinja', path.join(CONFIG.path.dist, 'hue.gl.svg'));
            templater.generateToFile('hue.gl.tex.jinja', path.join(CONFIG.path.dist, 'hue.gl.tex'));
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            yield directoryCreator.createDirectories('.', directories);
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