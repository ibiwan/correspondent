export const evalRef = (annotation, sectionContext) => {
    const { refName, varName } = annotation.params;

    sectionContext.varRefs[varName ?? refName] = refName;
};
