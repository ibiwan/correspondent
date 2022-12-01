import * as crypto from "crypto";
import * as path from "path";
import { FileContentError } from "../error/errors.js";
import { parse } from "../parse/extendedHttpParse.js";
import { getSections } from "../parse/fileParse.js";
import { evaluators } from "./evaluators/index.js";
class RootContext {
    constructor() {
        this.loadedSections = [];
    }
}
export class SectionContext {
    constructor(sectionDef, options) {
        var _a;
        this.vars = {};
        this.varRefs = {};
        this.neededVars = {};
        console.log({ sectionDef });
        this.sectionDef = sectionDef;
        const { workingDir, loadingSection = null } = options;
        this.rootContext = (_a = loadingSection === null || loadingSection === void 0 ? void 0 : loadingSection.rootContext) !== null && _a !== void 0 ? _a : new RootContext();
        this.rootContext.loadedSections.push(this);
        this.workingDir = workingDir;
        this.sectionKey = crypto
            .createHash("sha256")
            .update(JSON.stringify(sectionDef))
            .digest("base64");
    }
}
export const executeSection = async (sectionDef, workingDir) => {
    const sectionContext = new SectionContext(sectionDef, { workingDir });
    await loadSection(sectionContext);
};
export const loadFile = (filePath, parentDir) => {
    const fileInDir = parentDir
        ? path.join(parentDir, filePath)
        : filePath;
    const workingDir = path.dirname(path.resolve(fileInDir));
    console.log({ filePath, parentDir, fileInDir, workingDir });
    const rawSections = getSections(fileInDir);
    const nonEmptySections = rawSections.filter((a) => a);
    const parsedSections = nonEmptySections.map(parse);
    return { parsedSections, workingDir };
};
const loadSection = async (sectionContext) => {
    const { sectionDef } = sectionContext;
    for (const annotation of sectionDef.annotations) {
        if (annotation.type in evaluators) {
            const evaluator = evaluators[annotation.type];
            await evaluator(annotation, sectionContext);
        }
        else {
            throw new FileContentError(`unknown annotation: ${annotation.type}`);
        }
    }
};
