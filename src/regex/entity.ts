import { o_, ReAtom, r_ } from "./atoms.js";

const maybe = (content: string): string => `(${content})?`;

export class Entity {
    _val: ReAtom;
    _maybe: Boolean = false;
    _prefix: ReAtom = "";
    _isSuffix: Boolean;
    constructor(val: ReAtom, isSuffix = false) {
        this._val = val;
        this._isSuffix = isSuffix;
    }
    prepend(prefix: ReAtom) {
        this._prefix = prefix;
        return this;
    }
    maybe() {
        this._maybe = true;
        return this;
    }
    toString() {
        const maybeMaybe = this._maybe ? maybe : (a: String) => a;
        return maybeMaybe(`${this._prefix}${this._val.toString()}`);
    }
}
export class Symbolic extends Entity {}
export const sym = (val: ReAtom, isSuffix = false) =>
    new Symbolic(val, isSuffix);

export class Textual extends Entity {}
export const txt = (val: ReAtom, isSuffix = false) =>
    new Textual(val, isSuffix);

export const entityJoin = (entities: Entity[]) => {
    const extended: Entity[] = [];
    entities.forEach((val, i) => {
        // console.log({ val });
        if (i === 0) {
            extended.push(val);
            return;
        }
        if (val instanceof Entity && val._isSuffix) {
            // don't prepend if val is a suffix
        } else if (
            val instanceof Symbolic ||
            entities[i - 1] instanceof Symbolic
        ) {
            val.prepend(o_);
        } else {
            val.prepend(r_);
        }
        extended.push(val);
    });
    return extended.join("");
};
