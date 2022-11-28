import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { parse as yamlParse } from "yaml";
import {
    FileExistenceError,
    MissingImporterError,
} from "../../error/errors.js";

const importXml = (buffer) => {
    const xmlParser = new XMLParser();
    const xml = xmlParser.parse(buffer, true);
    // console.log({ xml });
    return xml;
};

const importJson = (buffer) => {
    const json = JSON.parse(buffer);
    // console.log({ json });
    return json;
};

const importYml = (buffer) => {
    const yml = yamlParse(buffer.toString());
    // console.log({ yml });
    return yml;
};

const importers = {
    json: importJson,
    xml: importXml,
    yml: importYml,
    yaml: importYml,
};

export const evalImportVals = (annotation, sectionContext) => {
    const { workingDir } = sectionContext;
    const { varName, fileName } = annotation.params;
    const filePath = path.join(workingDir, fileName);

    if (!fs.existsSync(filePath)) {
        throw new FileExistenceError(
            `could not find file "${fileName}" -- looked at "${filePath}"`
        );
    }

    const extension = path.extname(fileName).slice(1).toLowerCase();
    if (!(extension in importers)) {
        throw new MissingImporterError(
            `do not know how to import: "${extension}"`
        );
    }

    const rawFile = fs.readFileSync(filePath);
    const importer = importers[extension];
    const val = importer(rawFile);
    sectionContext.vars[varName] = val;
};
