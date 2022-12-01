import { readFileSync } from "fs";
import { lineTypes } from "./lineTypes.js";
import { annotationTypes } from "./annotationTypes.js";
import { ParsedHttpMessage } from "./extendedHttpParse.js";

const findLast = (arr: NumberedLine[], fn: (a: NumberedLine) => boolean) =>
    arr.filter(fn).pop();

export class Annotation {
    lineNo: Number;
    line: string;
    regEx: RegExp;
    type: string;
    params: { [x: string]: string };
    constructor(
        lineNo: Number,
        line: string,
        regEx: RegExp,
        type: string,
        params: { [x: string]: string }
    ) {
        this.lineNo = lineNo;
        this.line = line;
        this.regEx = regEx;
        this.type = type;
        this.params = params;
    }
}

interface NumberedLine {
    i: Number;
    line: string;
}

interface NumberedComment {
    line: Number;
    comment: string;
}

export class RequestSection {
    lines: NumberedLine[] = [];
    annotations: Annotation[] = [];
    comments: NumberedComment[] = [];
    bodyLines: Number[] = [];
    body: string;
    request?: ParsedHttpMessage;
}

const sortLine = (req: RequestSection, line: string, i: Number) => {
    // console.log("will sort", { line });

    // console.log({ lineTypes });

    if (lineTypes.delimiter.test(line)) {
        // console.log("is delimiter");
        return true;
    }

    if (lineTypes.annotation.test(line)) {
        // console.log("is annotation");
        const annotations: Annotation[] = [];
        annotationTypes.forEach(({ type, regExes }) => {
            regExes.forEach((regEx) => {
                const matches = regEx.exec(line);
                const matchGroups = { ...matches?.groups };
                // console.log({ line, regEx, matches });
                if (matches) {
                    annotations.push(
                        new Annotation(
                            i,
                            line,
                            regEx,
                            type,
                            // Object.assign({}, matches?.groups)
                            matchGroups
                        )
                    );
                }
            });
        });
        if (annotations.length > 0) {
            req.annotations.push(...annotations);
        } else {
            req.lines.push({ i, line });
            req.bodyLines.push(i);
        }
    } else if (lineTypes.comment.test(line)) {
        // console.log("is comment");
        req.comments.push({ line: i, comment: line });
    } else {
        // console.log("is just line");
        req.lines.push({ i, line });
        req.bodyLines.push(i);
    }
};

export const getSections = (filePath: string) => {
    const text = readFileSync(filePath, "utf-8");

    let req = new RequestSection();
    const sectionBlocks: RequestSection[] = text
        .split("\n")
        .reduce((blocks: RequestSection[], line: string, i: Number) => {
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

    console.log({ a: sectionBlocks[0].annotations[0]?.params });

    return sectionBlocks;
};

const joinBody = (req: RequestSection) => {
    const [first, last]: Number[] = [
        req.lines.find(({ line }) => line)?.i,
        findLast(req.lines, ({ line }) => Boolean(line))?.i,
    ];

    const trimmed: NumberedLine[] = req.lines.filter(
        ({ i }) => first <= i && i <= last
    );

    req.body = trimmed
        .map(({ line }) => line)
        .join("\n")
        .trim();
    req.bodyLines = trimmed.map(({ i }) => i);

    return req;
};
