const getCases = require("./src/fileParse");
const parse = require("./src/extendedHttpParse");

const parsedCases = getCases()
    .filter((a) => a)
    .map(parse);

console.dir({ parsedCases }, { depth: 6 });
// parsedCases.forEach((aCase) => {
//     aCase?.multipart?.forEach((part) => {
//         console.log(part);
//     });
// });
