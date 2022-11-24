import { parse } from "../src/parse/extendedHttpParse.js";
import { getCases } from "../src/parse/fileParse.js";

const parsedCases = getCases()
    .filter((a) => a)
    .map(parse);

console.dir({ parsedCases }, { depth: 6 });
