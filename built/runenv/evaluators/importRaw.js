import * as fs from "fs";
import * as path from "path";
import { FileExistenceError, MissingImporterError, } from "../../error/errors.js";
const importText = (filePath, encoding = "ascii") => {
    return fs.readFileSync(filePath, { encoding });
};
const importBinary = (filePath) => {
    return fs.readFileSync(filePath);
};
const importers = {
    text: importText,
    binary: importBinary,
};
export const evalImportRaw = (annotation, sectionContext) => {
    const { workingDir } = sectionContext;
    const { varName, fileName, dataType, encoding } = annotation.params;
    const filePath = path.join(workingDir, fileName);
    if (!fs.existsSync(filePath)) {
        throw new FileExistenceError(`could not find file "${fileName}" -- looked at "${filePath}"`);
    }
    if (!(dataType in importers)) {
        throw new MissingImporterError(`do not know how to import: "${dataType}"`);
    }
    const importer = importers[dataType];
    const val = importer(filePath, encoding);
    sectionContext.vars[varName] = val;
};
