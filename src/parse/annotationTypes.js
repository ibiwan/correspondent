import { entityJoin, sym } from "../regex/entity.js";
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

const annoDef = ([name, keyword, symbol]) => ({
    name,
    keyword,
    symbol: sym(symbol),
});

const annoSet = (defs) =>
    defs.reduce(
        (acc, { name, keyword, symbol }) => ({
            ...acc,
            [name]: { kw: keyword, sym: symbol },
        }),
        {}
    );

const annotationType = annoSet(
    [
        ["set", "set", "="],
        ["importVals", "import-vals", "<"],
        ["importRaw", "import-", "<<"],
        ["name", "name", "&"],
        ["ref", "ref", "\\*"],
        ["exec", "exec", "\\$"],
        ["prompt", "prompt", "\\?"],
        ["include", "include", "#"],
    ].map(annoDef)
);

const arrToAnnotation = ([type, ...regExes]) => ({ type, regExes });

export const annotationTypes = [
    [
        "set",
        [varName(), annotationType.set.sym, rest()],
        [annotationType.set.sym, varName(), rest()],
        [annotationType.set.kw, varName(), rest()],
    ],
    [
        "import-vals",
        [annotationType.importVals.sym, fileName()],
        [annotationType.importVals.kw, fileName()],
    ],
    [
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
        ],
    ],
    [
        "name",
        [annotationType.name.sym, refName()],
        [annotationType.name.kw, refName()],
    ],
    [
        "ref",
        [annotationType.ref.sym, refName(), varName().maybe()],
        [annotationType.ref.kw, refName(), varName().maybe()],
    ],
    [
        "exec",
        [annotationType.exec.sym, fileName()],
        [annotationType.exec.kw, fileName()],
        [],
    ],
    [
        "prompt",
        [annotationType.prompt.sym, varName(), prompt()],
        [annotationType.prompt.kw, varName(), prompt()],
        [],
    ],
]
    .map(arrToAnnotation)
    .map(({ type, regExes }) => ({
        type,
        regExes: regExes.map((parts) => annoRe(entityJoin(parts))),
    }));

// annotationTypes.forEach(({ type, regExes }) => console.log({ type, regExes }));
