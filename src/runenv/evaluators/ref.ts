import { Evaluator } from ".";

export const evalRef: Evaluator = (annotation, sectionContext) => {
    const { refName, varName } = annotation.params;

    sectionContext.varRefs[varName ?? refName] = refName;
};
