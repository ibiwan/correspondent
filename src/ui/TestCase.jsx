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
        if (dest.body.gqlD) {
            return JSON.stringify({
                query: dest?.body?.gqlD?.parsed?.loc?.source?.body,
                variables: dest?.body?.gqlD?.rest?.json,
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

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
            }}
        >
            <span style={{ flex: 2 }} />
            {initialSrc ? (
                <pre
                    style={{
                        flex: 5,
                        textAlign: "left",
                        background: "#CCCCCC",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {initialSrc}
                </pre>
            ) : (
                <input
                    type="textarea"
                    name="input-source"
                    value={src}
                    onChange={updateSrc}
                    placeholder="Enter HTTP Request block here"
                    style={{ flex: 5, background: "#EEEEEE" }}
                />
            )}{" "}
            <div style={{ flex: 1 }}>--&gt;</div>
            <pre
                style={{
                    flex: 5,
                    textAlign: "left",
                    background: "#CCCCCC",
                    whiteSpace: "pre-wrap",
                }}
            >
                {JSON.stringify(dest, null, 2)}
            </pre>
            <span style={{ flex: 2 }} />
            <button style={{ flex: 1 }} onClick={tryIt} disabled={!dest}>
                Try It!
            </button>
            {/* <pre style={{ flex: 5 }}>{resp}</pre> */}
        </div>
    );
};
