export const evalSet = (annotation, sectionContext) => {
    const {
        params: { varName, rest },
    } = annotation;
    sectionContext.vars[varName] = rest;

    // later: check for {{interp}} values in "rest" string
};
