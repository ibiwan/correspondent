import { loadFile } from "../executeSection.js";
import { Evaluator } from "./index.js";

export const evalInclude: Evaluator = (annotation, sectionContext) => {
    // console.log({ annotation });
    // console.log({ sectionContext });
    const { workingDir: parentDir } = sectionContext;
    const { fileName } = annotation.params;
    // console.log({ fileName });
    const { parsedSections, workingDir } = loadFile(fileName, parentDir);
    console.log("parsedSections", parsedSections);
    // const newSection = new SectionContext();
};
