import { parse as gqlParse } from "graphql";
import { XMLParser } from "fast-xml-parser";
import { v4 as uuid } from "uuid";
import { parse as yamlParse } from "yaml";

import httpMessageParser from "@ibiwan/http-message-parser";
import { RequestSection } from "./fileParse";

export interface ParsedHttpMessage {
    id: string;
    method?: string;
    url?: string;
    type: string;
    headers?: Object;
    boundary?: string;
    multipart?: [];
    body?: string | Object;
    message?: string;
}

const validate = (message: ParsedHttpMessage) => {
    const hasUrl = "url" in message;
    const hasStatusCode = "statusCode" in message;
    if (!hasUrl && !hasStatusCode) {
        message.message = "***NEITHER***";
    }
};

const findBlock = (text: string) => {
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

const xmlParser = new XMLParser();

type Parser = (x: string) => Object;
export type Lookup<T> = { [x: string]: T };

const parsers: Lookup<Parser> = {
    raw: (x: string) => x,
    gqlD: findBlock,
    gql: gqlParse,
    json: JSON.parse,
    xml: (body) => xmlParser.parse(body, true),
    yml: yamlParse,
};

const parseBody = (body: string): {} => {
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

export const parse = (src: RequestSection) => {
    if (!src) {
        return null;
    }

    const parsed: ParsedHttpMessage = httpMessageParser(src.body);

    validate(parsed);

    src.request = parsed;

    parsed.id = uuid();
    if (typeof parsed.body === "string" && parsed.body !== "") {
        parsed.body = parseBody(parsed.body);
    }

    return src;
};
