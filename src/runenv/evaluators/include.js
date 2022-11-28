import { loadFile, SectionContext } from "../executeSection.js";

export const evalInclude = (annotation, sectionContext) => {
    // console.log({ annotation });
    // console.log({ sectionContext });
    const { workingDir: parentDir } = sectionContext;
    const { fileName } = annotation.params;
    // console.log({ fileName });
    const { parsedSections, workingDir } = loadFile(fileName, parentDir);
    console.log("parsedSections", parsedSections);
    // const newSection = new SectionContext();
};
