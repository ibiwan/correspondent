import { evalInclude } from "./include.js";
import { evalImportRaw } from "./importRaw.js";
import { evalImportVals } from "./importVals.js";
import { evalName } from "./name.js";
import { evalPrompt } from "./prompt.js";
import { evalRef } from "./ref.js";
import { evalSet } from "./set.js";

export const evaluators = {
    _include: evalInclude,
    exec: () => {},
    set: evalSet,
    "import-vals": evalImportVals,
    "import-raw": evalImportRaw,
    name: evalName,
    ref: evalRef,
    prompt: evalPrompt,
};
