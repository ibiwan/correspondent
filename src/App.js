import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { TestCase } from "./TestCase";

import "./App.css";

const fetchCases = async () =>
    fetch("input.jttp").then(async (response) => {
        const text = await response.text();

        let caseLines = [];
        const delim = RegExp("^s*#{3,}s*$");
        const caseBlocks = text.split("\n").reduce((blocks, line) => {
            if (delim.test(line)) {
                if (caseLines.length > 0) {
                    blocks.push(caseLines.join("\n"));
                    caseLines = [];
                }
            } else {
                caseLines.push(line);
            }

            return blocks;
        }, []);
        if (caseLines.length > 0) {
            caseBlocks.push(caseLines.join("\n"));
        }

        return caseBlocks;
    });

function App() {
    const [cases, setCases] = useState();

    useEffect(() => {
        fetchCases().then((caseSrces) => {
            const caseObjs = caseSrces.map((src) => ({ src, id: uuid() }));
            setCases(caseObjs);
        });
    }, []);

    const addCase = useCallback(() => {
        setCases([...cases, { id: uuid() }]);
    }, [cases, setCases]);

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {cases &&
                cases.map(({ id, src }) => <TestCase key={id} src={src} />)}
            <button onClick={addCase}>+</button>
        </div>
    );
}

export default App;
