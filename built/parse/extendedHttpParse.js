import { parse as gqlParse } from "graphql";
import { XMLParser } from "fast-xml-parser";
import { v4 as uuid } from "uuid";
import { parse as yamlParse } from "yaml";
import httpMessageParser from "@ibiwan/http-message-parser";
const validate = (message) => {
    const hasUrl = "url" in message;
    const hasStatusCode = "statusCode" in message;
    if (!hasUrl && !hasStatusCode) {
        message.message = "***NEITHER***";
    }
};
const findBlock = (text) => {
    var _a, _b;
    const lines = text.split(/\n|\r\n/);
    for (let i = 0; i < lines.length; i++) {
        for (let j = lines.length - 1; j >= i; j--) {
            const someLines = lines.slice(i, j);
            try {
                const parsed = gqlParse(someLines.join("\n"));
                const rest = [...lines.slice(0, i), ...lines.slice(j)].join("\n");
                return {
                    parsed,
                    parsedQuery: (_b = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.loc) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.body,
                    rest: parseBody(rest),
                };
            }
            catch (_c) { }
        }
    }
    return false;
};
const xmlParser = new XMLParser();
const parsers = {
    raw: (x) => x,
    gqlD: findBlock,
    gql: gqlParse,
    json: JSON.parse,
    xml: (body) => xmlParser.parse(body, true),
    yml: yamlParse,
};
const parseBody = (body) => {
    const parsedEntries = Object.entries(parsers)
        .map(([key, parser]) => {
        try {
            return [key, parser(body)];
        }
        catch (e) {
            return [key, false];
        }
    })
        .filter(([_k, v]) => v);
    return Object.fromEntries(parsedEntries);
};
export const parse = (src) => {
    if (!src) {
        return null;
    }
    const parsed = httpMessageParser(src.body);
    validate(parsed);
    src.request = parsed;
    parsed.id = uuid();
    if (typeof parsed.body === "string" && parsed.body !== "") {
        parsed.body = parseBody(parsed.body);
    }
    return src;
};
