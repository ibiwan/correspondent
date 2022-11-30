export const evalName = (annotation, sectionContext) => {
    const { refName } = annotation.params;
    sectionContext.sectionName = refName;
};
