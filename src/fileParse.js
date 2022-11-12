const { readFileSync } = require("fs");

const getCases = () => {
    const text = readFileSync("public/input.jttp", "utf-8");

    let caseLines = [];
    const delim = RegExp("^s*#{3,}s*$");
    const caseBlocks = text.split("\n").reduce((blocks, line) => {
        if (delim.test(line)) {
            if (caseLines.length > 0) {
                blocks.push(caseLines.join("\n"));
                caseLines = [];
            }
        } else {
            caseLines.push(line);
        }
        return blocks;
    }, []);
    if (caseLines.length > 0) {
        caseBlocks.push(caseLines.join("\n"));
    }
    return caseBlocks
};

module.exports = getCases;
