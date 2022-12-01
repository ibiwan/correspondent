import { Evaluator } from ".";

export const evalName: Evaluator = (annotation, sectionContext) => {
    const { refName } = annotation.params;
    sectionContext.sectionName = refName;
};
