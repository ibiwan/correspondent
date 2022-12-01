import { readFileSync } from "fs";
import { lineTypes } from "./lineTypes.js";
import { annotationTypes } from "./annotationTypes.js";
const findLast = (arr, fn) => arr.filter(fn).pop();
export class Annotation {
    constructor(lineNo, line, regEx, type, params) {
        this.lineNo = lineNo;
        this.line = line;
        this.regEx = regEx;
        this.type = type;
        this.params = params;
    }
}
export class RequestSection {
    constructor() {
        this.lines = [];
        this.annotations = [];
        this.comments = [];
        this.bodyLines = [];
    }
}
const sortLine = (req, line, i) => {
    // console.log("will sort", { line });
    // console.log({ lineTypes });
    if (lineTypes.delimiter.test(line)) {
        // console.log("is delimiter");
        return true;
    }
    if (lineTypes.annotation.test(line)) {
        // console.log("is annotation");
        const annotations = [];
        annotationTypes.forEach(({ type, regExes }) => {
            regExes.forEach((regEx) => {
                const matches = regEx.exec(line);
                const matchGroups = { ...matches === null || matches === void 0 ? void 0 : matches.groups };
                // console.log({ line, regEx, matches });
                if (matches) {
                    annotations.push(new Annotation(i, line, regEx, type, 
                    // Object.assign({}, matches?.groups)
                    matchGroups));
                }
            });
        });
        if (annotations.length > 0) {
            req.annotations.push(...annotations);
        }
        else {
            req.lines.push({ i, line });
            req.bodyLines.push(i);
        }
    }
    else if (lineTypes.comment.test(line)) {
        // console.log("is comment");
        req.comments.push({ line: i, comment: line });
    }
    else {
        // console.log("is just line");
        req.lines.push({ i, line });
        req.bodyLines.push(i);
    }
};
export const getSections = (filePath) => {
    var _a;
    const text = readFileSync(filePath, "utf-8");
    let req = new RequestSection();
    const sectionBlocks = text
        .split("\n")
        .reduce((blocks, line, i) => {
        const isDelim = sortLine(req, line, i);
        if (isDelim) {
            blocks.push(joinBody(req));
            req = new RequestSection();
        }
        return blocks;
    }, []);
    if (req.lines.length > 0) {
        sectionBlocks.push(joinBody(req));
        // req = new RequestSection();
    }
    console.log({ a: (_a = sectionBlocks[0].annotations[0]) === null || _a === void 0 ? void 0 : _a.params });
    return sectionBlocks;
};
const joinBody = (req) => {
    var _a, _b;
    const [first, last] = [
        (_a = req.lines.find(({ line }) => line)) === null || _a === void 0 ? void 0 : _a.i,
        (_b = findLast(req.lines, ({ line }) => Boolean(line))) === null || _b === void 0 ? void 0 : _b.i,
    ];
    const trimmed = req.lines.filter(({ i }) => first <= i && i <= last);
    req.body = trimmed
        .map(({ line }) => line)
        .join("\n")
        .trim();
    req.bodyLines = trimmed.map(({ i }) => i);
    return req;
};
