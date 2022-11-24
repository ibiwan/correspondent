import { annotationGuard, o_ } from "./atoms.js";
import { end, start } from "./tokens.js";

export const lineRe = (content) => RegExp(start() + content + o_ + end());
export const annoRe = (content) => lineRe(annotationGuard + o_ + content);
