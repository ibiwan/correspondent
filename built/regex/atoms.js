export class ReAtom {
    constructor(str) {
        this.str = str;
    }
    toString() {
        return this.str;
    }
}
export const o_ = new ReAtom("\\s*");
export const r_ = new ReAtom("\\s+");
export const blockDelimiter = new ReAtom("#");
export const annotationGuard = new ReAtom("@");
export const _BINARY = "binary";
export const _TEXT = "text";
