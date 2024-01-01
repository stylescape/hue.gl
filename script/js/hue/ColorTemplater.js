import { __awaiter } from "tslib";
import fs from 'fs/promises';
import nunjucks from 'nunjucks';
class ColorTemplater {
    constructor(packageJson, colors, templatesDir, enableCache = false) {
        this.packageJson = packageJson;
        this.colors = colors;
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
                throw error;
            }
        });
    }
    generateToFile(template, outputFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield this.generateTemplate(template);
                yield fs.writeFile(outputFile, content, 'utf-8');
            }
            catch (error) {
                console.error(`Error writing to file: ${error}`);
                throw error;
            }
        });
    }
}
export default ColorTemplater;
//# sourceMappingURL=ColorTemplater.js.map