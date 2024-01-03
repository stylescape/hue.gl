import { __awaiter } from "tslib";
import fs from 'fs/promises';
import nunjucks from 'nunjucks';
import path from 'path';
import BaseWriter from './BaseWriter.js';
class TemplateWriter extends BaseWriter {
    constructor(packageJson, colors, templatesDir, enableCache = false) {
        super(packageJson, colors);
        nunjucks.configure(templatesDir, {
            autoescape: true,
            noCache: !enableCache
        });
    }
    generateTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return nunjucks.render(template, {
                    colors: this.colors,
                    name: this.packageJson["name"],
                    version: this.packageJson["version"],
                    website: this.packageJson["homepage"],
                });
            }
            catch (error) {
                console.error(`Error generating template: ${error}`);
                throw new Error('Template generation failed');
            }
        });
    }
    generateToFile(template, outputFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield this.generateTemplate(template);
                const dir = path.dirname(outputFile);
                yield fs.mkdir(dir, { recursive: true });
                yield fs.writeFile(outputFile, content, 'utf-8');
            }
            catch (error) {
                console.error(`Error writing to file: ${error}`);
                throw new Error('File writing failed');
            }
        });
    }
}
export default TemplateWriter;
//# sourceMappingURL=TemplateWriter.js.map