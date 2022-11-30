import { useState } from "react";
import { parse } from "./extendedHttpParse";
export const TestSection = ({ src: initialSrc = null }) => {
    const [src, setSrc] = useState(initialSrc);
    const [dest, setDest] = useState(parse(src));
    const [resp, setResp] = useState(null);
    const updateSrc = (evt) => {
        const newSrc = evt.target.value;
        setSrc(newSrc);
        setDest(parse(newSrc));
    };
    const getBody = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (dest.body.gqlD) {
            return JSON.stringify({
                query: (_e = (_d = (_c = (_b = (_a = dest === null || dest === void 0 ? void 0 : dest.body) === null || _a === void 0 ? void 0 : _a.gqlD) === null || _b === void 0 ? void 0 : _b.parsed) === null || _c === void 0 ? void 0 : _c.loc) === null || _d === void 0 ? void 0 : _d.source) === null || _e === void 0 ? void 0 : _e.body,
                variables: (_h = (_g = (_f = dest === null || dest === void 0 ? void 0 : dest.body) === null || _f === void 0 ? void 0 : _f.gqlD) === null || _g === void 0 ? void 0 : _g.rest) === null || _h === void 0 ? void 0 : _h.json,
            });
        }
        return dest.body;
    };
    const tryIt = () => {
        if (dest.type !== "request") {
            return;
        }
        const { url, method, httpVersion, headers } = dest;
        const body = getBody();
        const params = {
            method,
            httpVersion,
            headers,
            body,
        };
        fetch(url, params)
            .then((data) => {
            data.blob().then(console.log);
            setResp(data);
        })
            .catch((e) => setResp("ERROR: " + e));
    };
    return (<div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
        }}>
            <span style={{ flex: 2 }}/>
            {initialSrc ? (<pre style={{
                flex: 5,
                textAlign: "left",
                background: "#CCCCCC",
                whiteSpace: "pre-wrap",
            }}>
                    {initialSrc}
                </pre>) : (<input type="textarea" name="input-source" value={src} onChange={updateSrc} placeholder="Enter HTTP Request block here" style={{ flex: 5, background: "#EEEEEE" }}/>)}{" "}
            <div style={{ flex: 1 }}>--&gt;</div>
            <pre style={{
            flex: 5,
            textAlign: "left",
            background: "#CCCCCC",
            whiteSpace: "pre-wrap",
        }}>
                {JSON.stringify(dest, null, 2)}
            </pre>
            <span style={{ flex: 2 }}/>
            <button style={{ flex: 1 }} onClick={tryIt} disabled={!dest}>
                Try It!
            </button>
            {/* <pre style={{ flex: 5 }}>{resp}</pre> */}
        </div>);
};
