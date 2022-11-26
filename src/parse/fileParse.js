import { readFileSync } from "fs";
import { lineTypes } from "./lineTypes.js";
import { annotationTypes } from "./annotationTypes.js";

const newRequest = () => ({
    lines: [],
    annotations: [],
    comments: [],
    bodyLines: [],
});

const sortLine = (req, line, i) => {
    if (lineTypes.delimiter.test(line)) {
        return true;
    }

    if (lineTypes.annotation.test(line)) {
        const annotations = [];
        annotationTypes.forEach(({ type, regExes }) => {
            regExes.forEach((regEx) => {
                const matches = regEx.exec(line);
                if (matches) {
                    annotations.push({
                        lineNo: i,
                        line,
                        regEx,
                        type,
                        params: Object.assign({}, matches?.groups),
                    });
                }
            });
        });
        if (annotations.length > 0) {
            req.annotations.push(...annotations);
        } else {
            req.lines.push(line);
            req.bodyLines.push(i);
        }
    } else if (lineTypes.comment.test(line)) {
        req.comments.push({ line: i, comment: line });
    } else {
        req.lines.push({ i, line });
        req.bodyLines.push(i);
    }
};

export const getSections = () => {
    const text = readFileSync("public/input.jttp", "utf-8");

    let req = newRequest();
    const sectionBlocks = text.split("\n").reduce((blocks, line, i) => {
        const isDelim = sortLine(req, line, i);
        if (isDelim) {
            blocks.push(req);
            req = newRequest();
        }

        return blocks;
    }, []);
    if (req.lines.length > 0) {
        const [first, last] = [
            req.lines.find(({ line }) => line).i,
            req.lines.findLast(({ line }) => line).i,
        ];
        const trimmed = req.lines.filter(({ i }) => first <= i && i <= last);
        req.body = trimmed
            .map(({ line }) => line)
            .join("\n")
            .trim();
        req.bodyLines = trimmed.map(({ i }) => i);
        sectionBlocks.push(req);
        req = newRequest();
    }
    return sectionBlocks;
};
