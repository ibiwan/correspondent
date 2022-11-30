import { Entity, sym, txt } from "./entity.js";
import { _BINARY, _TEXT } from "./atoms.js";

const tokenWith = (name: String, content: String, isSuffix = false): Entity =>
    txt(`(?<${name}>${content})`, isSuffix);

const token = (name: String, moreChar = "", isSuffix = false): Entity =>
    tokenWith(name, `[a-zA-Z0-9_\\-${moreChar}]+`, isSuffix);

const keyword = (name: String, value: String, isSuffix = false): Entity =>
    tokenWith(name, value, isSuffix);

export const start = () => sym("^");
export const end = () => sym("$");
export const rest = () => txt("(?<rest>.*)");

export const varName = () => token("varName");
export const fileName = () => token("fileName", ".\\/\\\\");
export const dataType = () => token("dataType");
export const encoding = () => token("encoding");
export const refName = () => token("refName");
export const prompt = () => token("prompt", " ?!.");

export const kwBinary = () => keyword("dataType", _BINARY, true);
export const kwText = () => keyword("dataType", _TEXT, true);
