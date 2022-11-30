import { blockDelimiter, o_ } from "../regex/atoms.js";
import { rest } from "../regex/tokens.js";
import { annoRe, lineRe } from "../regex/wrappers.js";
export const lineTypes = {
    delimiter: lineRe(blockDelimiter + "{3,}"),
    annotation: annoRe(`${rest()}`),
    comment: lineRe(o_ + "(#|//)" + rest()),
};
