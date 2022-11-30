import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
export const evalPrompt = async (annotation, sectionContext) => {
    const { varName, prompt } = annotation.params;
    const rl = readline.createInterface({ input, output });
    const val = await rl.question(prompt);
    rl.close();
    sectionContext.vars[varName] = val;
};
