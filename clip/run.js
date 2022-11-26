import * as readline from "node:readline/promises";
import { exit, stdin as input, stdout as output } from "node:process";

import { parse } from "../src/parse/extendedHttpParse.js";
import { getSections } from "../src/parse/fileParse.js";

const parsedSections = getSections()
    .filter((a) => a)
    .map(parse);

// console.dir({ parsedSections }, { depth: 6 });

const sectionOptions = parsedSections.map((section, i) => {
    const { request, comments, annotations } = section;
    const { method, url, type } = request;
    const requestSketch = `${i}) ${type}: ${method} ${url}`;
    const commentSketch = comments.map(
        ({ line, comment }) => `${line}: ${comment}`
    );
    const annotationSketch = annotations.map(
        ({ type, params }) => `${type}: ${JSON.stringify(params)}`
    );
    return {
        i,
        request: requestSketch,
        comments: commentSketch,
        annotations: annotationSketch,
    };
});

const actions = {
    S: "see details",
    X: "execute",
    V: "show vars",
};

console.log("sections:\n");
sectionOptions.forEach(({ request }) => console.log(request));
console.log();

console.log("actions:\n");
Object.entries(actions).forEach(([key, value]) =>
    console.log(`${key}) ${value}`)
);

const rl = readline.createInterface({ input, output });
const c = await rl.question(":  ");
console.log({ c });
rl.close();

const nums = [...c.matchAll("\\d+")];
const lets = [...c.matchAll("[a-zA-Z]+")];

console.log({ nums, lets });

if (nums.length === 0) {
    console.log("we need a section number to work with");
    exit(1);
}

if (lets.length === 0) {
    console.log("we need an action to work with");
    exit(2);
}

const selectedSection = parseInt(nums[0][0]);
const selectedAction = lets[0][0].toUpperCase();
console.log({ selectedAction });

if (selectedSection in sectionOptions && selectedAction in actions) {
    const actionName = actions[selectedAction];
    const section = sectionOptions[selectedSection];
    console.log({
        section: section.request,
        actionName,
    });

    switch (actionName) {
        case "see details":
            console.log(section);
            break;
        default:
    }
} else {
    console.log("I don't know that one");
    exit(3);
}
