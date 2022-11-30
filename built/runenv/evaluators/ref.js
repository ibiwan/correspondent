export const evalRef = (annotation, sectionContext) => {
    const { refName, varName } = annotation.params;
    sectionContext.varRefs[varName !== null && varName !== void 0 ? varName : refName] = refName;
};
