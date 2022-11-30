import { Entity, entityJoin, sym } from "../regex/entity.js";
import {
    dataType,
    encoding,
    fileName,
    kwBinary,
    kwText,
    prompt,
    refName,
    rest,
    varName,
} from "../regex/tokens.js";
import { annoRe } from "../regex/wrappers.js";

class AnnotationEntry {
    kw: any;
    sym: Entity;
    constructor(keyword, symbol) {
        this.kw = keyword;
        this.sym = sym(symbol);
    }
}

const annotationType: { [x: string]: AnnotationEntry } = {
    set: new AnnotationEntry("set", "="),
    importVals: new AnnotationEntry("import-vals", "<"),
    importRaw: new AnnotationEntry("import-", "<<"),
    name: new AnnotationEntry("name", "&"),
    ref: new AnnotationEntry("ref", "\\*"),
    exec: new AnnotationEntry("exec", "\\$"),
    prompt: new AnnotationEntry("prompt", "\\?"),
    include: new AnnotationEntry("include", "#"),
};

class AnnotationMatchers {
    type: string;
    regExes: RegExp[];
    constructor(type: string, regExes: RegExp[]) {
        this.type = type;
        this.regExes = regExes;
    }
}

class AnnotationMatcherComponents {
    type: string;
    components: Entity[][];
    constructor(type: string, ...components: Entity[][]) {
        this.type = type;
        this.components = components;
    }
}

export const annotationTypes = [
    new AnnotationMatcherComponents(
        "set",
        [varName(), annotationType.set.sym, rest()],
        [annotationType.set.sym, varName(), rest()],
        [annotationType.set.kw, varName(), rest()]
    ),
    new AnnotationMatcherComponents(
        "import-vals",
        [annotationType.importVals.sym, varName(), fileName()],
        [annotationType.importVals.kw, varName(), fileName()]
    ),
    new AnnotationMatcherComponents(
        "import-raw",
        [
            annotationType.importRaw.sym,
            varName(),
            fileName(),
            dataType(),
            encoding().maybe(),
        ],
        [annotationType.importRaw.kw, kwBinary(), varName(), fileName()],
        [
            annotationType.importRaw.kw,
            kwText(),
            varName(),
            fileName(),
            encoding().maybe(),
        ]
    ),
    new AnnotationMatcherComponents(
        "name",
        [annotationType.name.sym, refName()],
        [annotationType.name.kw, refName()]
    ),
    new AnnotationMatcherComponents(
        "ref",
        [annotationType.ref.sym, refName(), varName().maybe()],
        [annotationType.ref.kw, refName(), varName().maybe()]
    ),
    new AnnotationMatcherComponents(
        "exec",
        [annotationType.exec.sym, fileName()],
        [annotationType.exec.kw, fileName()]
    ),
    new AnnotationMatcherComponents(
        "prompt",
        [annotationType.prompt.sym, varName(), prompt()],
        [annotationType.prompt.kw, varName(), prompt()]
    ),
    new AnnotationMatcherComponents(
        "_include",
        [annotationType.include.sym, fileName()],
        [annotationType.include.kw, fileName()]
    ),
].map(
    (amc: AnnotationMatcherComponents) =>
        new AnnotationMatchers(
            amc.type,
            amc.components.map((parts) => annoRe(entityJoin(parts)))
        )
);

// annotationTypes.forEach(({ type, regExes }) => console.log({ type, regExes }));
