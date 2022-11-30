import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { parse as yamlParse } from "yaml";
import { FileExistenceError, MissingImporterError, } from "../../error/errors.js";
const importText = (filePath, encoding = "ascii") => {
    const rawFile = fs.readFileSync(filePath, { encoding });
    return rawFile;
};
const importBinary = (filePath) => {
    const rawFile = fs.readFileSync(filePath, { encoding: "binary" });
    return rawFile;
};
const importers = {
    text: importText,
    binary: importBinary,
};
export const evalImportRaw = (annotation, sectionContext) => {
    // console.log({ annotation });
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
