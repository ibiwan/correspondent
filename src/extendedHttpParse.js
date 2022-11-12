const { parse: gqlParse } = require("graphql");
const { XMLParser } = require("fast-xml-parser");
const { v4: uuid } = require("uuid");
const { parse: yamlParse } = require("yaml");

const httpMessageParser = require("@ibiwan/http-message-parser");

const validate = (message) => {
    const hasUrl = "url" in message;
    const hasStatusCode = "statusCode" in message;
    if (!hasUrl && !hasStatusCode) {
        message.message = "***NEITHER***";
    }
};

const findBlock = (text) => {
    const lines = text.split(/\n|\r\n/);
    for (let i = 0; i < lines.length; i++) {
        for (let j = lines.length - 1; j >= i; j--) {
            const someLines = lines.slice(i, j);
            try {
                const parsed = gqlParse(someLines.join("\n"));
                const rest = [...lines.slice(0, i), ...lines.slice(j)].join(
                    "\n"
                );
                return {
                    parsed,
                    parsedQuery: parsed?.loc?.source?.body,
                    rest: parseBody(rest),
                };
            } catch {}
        }
    }
    return false;
};

const parser = new XMLParser();

const parsers = {
    raw: (x) => x,
    gqlD: findBlock,
    gql: gqlParse,
    json: JSON.parse,
    xml: (body) => parser.parse(body, true),
    yml: yamlParse,
};

const parseBody = (body) => {
    const parsedEntries = Object.entries(parsers)
        .map(([key, parser]) => {
            try {
                return [key, parser(body)];
            } catch (e) {
                return [key, false];
            }
        })
        .filter(([_k, v]) => v);
    return Object.fromEntries(parsedEntries);
};

const parse = (src) => {
    if (!src) {
        return null;
    }
    const parsed = httpMessageParser(src);
    const minimItems = Object.entries(parsed).filter(([k, v]) => v);

    const minim = Object.fromEntries(minimItems);
    validate(minim);

    minim.id = uuid();
    if (minim.body) {
        minim.body = parseBody(minim.body);
    }

    return minim;
};

module.exports = parse;
