import * as crypto from "crypto";
import * as path from "path";
import { FileContentError } from "../error/errors.js";

import { parse } from "../parse/extendedHttpParse.js";
import { RequestSection, getSections } from "../parse/fileParse.js";
import { evaluators } from "./evaluators/index.js";

class RootContext {
    loadedSections: SectionContext[] = [];
}

interface SectionContextOptions {
    workingDir: string;
    loadingSection?: SectionContext;
}

export class SectionContext {
    sectionDef: RequestSection;
    rootContext: RootContext;
    vars: { [t: string]: any } = {};
    varRefs: { [t: string]: string } = {};
    neededVars: {} = {};
    sectionName: string;
    workingDir: string;
    sectionKey: string;
    constructor(sectionDef: RequestSection, options: SectionContextOptions) {
        console.log({ sectionDef });
        this.sectionDef = sectionDef;
        const { workingDir, loadingSection = null } = options;
        this.rootContext = loadingSection?.rootContext ?? new RootContext();
        this.rootContext.loadedSections.push(this);

        this.workingDir = workingDir;

        this.sectionKey = crypto
            .createHash("sha256")
            .update(JSON.stringify(sectionDef))
            .digest("base64");
    }
}

export const executeSection = async (
    sectionDef: RequestSection,
    workingDir: string
) => {
    const sectionContext = new SectionContext(sectionDef, { workingDir });

    await loadSection(sectionContext);
};

export const loadFile = (filePath: string, parentDir?: string) => {
    const fileInDir: string = parentDir
        ? path.join(parentDir, filePath)
        : filePath;
    const workingDir: string = path.dirname(path.resolve(fileInDir));

    console.log({ filePath, parentDir, fileInDir, workingDir });

    const rawSections: RequestSection[] = getSections(fileInDir);
    const nonEmptySections: RequestSection[] = rawSections.filter((a) => a);
    const parsedSections = nonEmptySections.map(parse);

    return { parsedSections, workingDir };
};

const loadSection = async (sectionContext: SectionContext) => {
    const { sectionDef } = sectionContext;
    for (const annotation of sectionDef.annotations) {
        if (annotation.type in evaluators) {
            const evaluator = evaluators[annotation.type];
            await evaluator(annotation, sectionContext);
        } else {
            throw new FileContentError(
                `unknown annotation: ${annotation.type}`
            );
        }
    }
};
