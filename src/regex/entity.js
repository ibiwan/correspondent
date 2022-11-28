import { o_, r_ } from "./atoms.js";

const maybe = (content) => `(${content})?`;

export class Entity {
    constructor(val, isSuffix = false) {
        this._val = val;
        this._maybe = false;
        this._prefix = "";
        this._isSuffix = isSuffix;
    }
    prepend(prefix) {
        this._prefix = prefix;
        return this;
    }
    maybe() {
        this._maybe = true;
        return this;
    }
    toString() {
        const maybeMaybe = this._maybe ? maybe : (a) => a;
        return maybeMaybe(this._prefix + this._val.toString());
    }
}
export class Symbolic extends Entity {}
export const sym = (val, isSuffix = false) => new Symbolic(val, isSuffix);

export class Textual extends Entity {}
export const txt = (val, isSuffix = false) => new Textual(val, isSuffix);

export const entityJoin = (entities) => {
    const extended = [];
    entities.forEach((val, i) => {
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
