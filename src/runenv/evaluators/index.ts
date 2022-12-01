import { evalInclude } from "./include.js";
import { evalImportRaw } from "./importRaw.js";
import { evalImportVals } from "./importVals.js";
import { evalName } from "./name.js";
import { evalPrompt } from "./prompt.js";
import { evalRef } from "./ref.js";
import { evalSet } from "./set.js";

import { Annotation } from "../../parse/fileParse.js";
import { SectionContext } from "../executeSection.js";
import { Lookup } from "../../parse/extendedHttpParse.js";

export type Evaluator = (a: Annotation, b: SectionContext) => void;

export const evaluators: Lookup<Evaluator> = {
    _include: evalInclude,
    exec: () => {},
    set: evalSet,
    "import-vals": evalImportVals,
    "import-raw": evalImportRaw,
    name: evalName,
    ref: evalRef,
    prompt: evalPrompt,
};
