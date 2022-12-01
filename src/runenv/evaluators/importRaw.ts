import * as fs from "fs";
import * as path from "path";

import {
    FileExistenceError,
    MissingImporterError,
} from "../../error/errors.js";
import { Evaluator } from "./index.js";

const importText = (
    filePath: string,
    encoding: BufferEncoding = "ascii"
): string => {
    return fs.readFileSync(filePath, { encoding });
};

const importBinary = (filePath: string): Buffer => {
    return fs.readFileSync(filePath);
};

type Importer = (t: any, u?: any) => string | Buffer;

const importers: { [t: string]: Importer } = {
    text: importText,
    binary: importBinary,
};

export const evalImportRaw: Evaluator = (annotation, sectionContext) => {
    const { workingDir } = sectionContext;
    const { varName, fileName, dataType, encoding } = annotation.params;

    const filePath = path.join(workingDir, fileName);

    if (!fs.existsSync(filePath)) {
        throw new FileExistenceError(
            `could not find file "${fileName}" -- looked at "${filePath}"`
        );
    }

    if (!(dataType in importers)) {
        throw new MissingImporterError(
            `do not know how to import: "${dataType}"`
        );
    }

    const importer = importers[dataType];
    const val = importer(filePath, encoding);
    sectionContext.vars[varName] = val;
};
