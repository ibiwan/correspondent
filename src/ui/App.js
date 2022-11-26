import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { TestSection } from "./TestSection";

import "./App.css";

const fetchSections = async () =>
    fetch("input.jttp").then(async (response) => {
        const text = await response.text();

        let sectionLines = [];
        const delim = RegExp("^s*#{3,}s*$");
        const sectionBlocks = text.split("\n").reduce((blocks, line) => {
            if (delim.test(line)) {
                if (sectionLines.length > 0) {
                    blocks.push(sectionLines.join("\n"));
                    sectionLines = [];
                }
            } else {
                sectionLines.push(line);
            }

            return blocks;
        }, []);
        if (sectionLines.length > 0) {
            sectionBlocks.push(sectionLines.join("\n"));
        }

        return sectionBlocks;
    });

function App() {
    const [sections, setSections] = useState();

    useEffect(() => {
        fetchSections().then((sectionSrces) => {
            const sectionObjs = sectionSrces.map((src) => ({ src, id: uuid() }));
            setSections(sectionObjs);
        });
    }, []);

    const addSection = useCallback(() => {
        setSections([...sections, { id: uuid() }]);
    }, [sections, setSections]);

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {sections &&
                sections.map(({ id, src }) => <TestSection key={id} src={src} />)}
            <button onClick={addSection}>+</button>
        </div>
    );
}

export default App;
