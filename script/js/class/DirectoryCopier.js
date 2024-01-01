import { __awaiter } from "tslib";
import fs from 'fs';
import path from 'path';
class DirectoryCopier {
    copyFiles(srcDir, destDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolvedSrcDir = path.resolve(srcDir);
                const resolvedDestDir = path.resolve(destDir);
                const files = fs.readdirSync(resolvedSrcDir);
                files.forEach(file => {
                    const srcFile = path.join(resolvedSrcDir, file);
                    const destFile = path.join(resolvedDestDir, file);
                    if (fs.statSync(srcFile).isFile()) {
                        fs.copyFileSync(srcFile, destFile);
                    }
                });
            }
            catch (error) {
                console.error('Error copying files:', error);
                throw error;
            }
        });
    }
}
export default DirectoryCopier;
//# sourceMappingURL=DirectoryCopier.js.map