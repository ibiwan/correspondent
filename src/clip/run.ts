import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { executeSection, loadFile } from "../runenv/executeSection.js";
import { UserInputError } from "../error/errors.js";

const run = async () => {
    const { parsedSections, workingDir } = loadFile("sampleData/input.jttp");

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

    const nums = [...c.matchAll(/\d+/g)];
    const lets = [...c.matchAll(/[a-zA-Z]+/g)];

    console.log({ nums, lets });

    if (nums.length === 0) {
        throw new UserInputError("Please input a section number to act on");
    }

    if (lets.length === 0) {
        throw new UserInputError("Please input an action code to execute");
    }

    const selectedAction = lets[0][0].toUpperCase();
    if (!(selectedAction in actions)) {
        throw new UserInputError("That was not a valid action.");
    }
    const actionName = actions[selectedAction];

    const selectedSection = parseInt(nums[0][0]);
    if (!(selectedSection in sectionOptions)) {
        throw new UserInputError("That was not a valid section.");
    }
    const section = parsedSections[selectedSection];

    switch (actionName) {
        case "see details":
            console.log(section);
            break;
        case "execute":
            await executeSection(section, workingDir);
            break;
        default:
    }
};

run();
