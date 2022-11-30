import { annotationGuard, o_ } from "./atoms.js";
import { end, start } from "./tokens.js";

export const lineRe = (content: String) =>
    RegExp(`${start()}${content}${o_}${end()}`);
export const annoRe = (content: String) =>
    lineRe(`${annotationGuard}${o_}${content}`);
