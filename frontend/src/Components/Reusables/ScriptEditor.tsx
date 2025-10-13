import React, { useContext, useEffect, useState } from "react";
import Editor from '@monaco-editor/react';
import ZThemeContext from "../../Contexts/ZThemeContext";

function ScriptEditor({onExit, scriptValue, language}: {
    onExit: (new_value: string) => void,
    scriptValue: string,
    language: string
}) {

    const {theme} = useContext(ZThemeContext);
    const [scriptText, setScriptText] = useState<string>("");

    useEffect(() => {
        setScriptText(scriptValue)
    }, [scriptValue])


    return (
        <div className="waiting-container d-flex justify-content-center" style={{zIndex: 100}}>
            <div className="card rounded shadow-lg zpanel" style={{width: "96%", height: "90%", top: 33}}>
                <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)", fontSize: "13px", fontWeight: "bold"}}>Script Editor</div>
                <div className="card-body h-100">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={theme.scheme == "zdark" ? "vs-dark" : "vs-light"}
                        defaultLanguage={language}
                        value={scriptText}
                        defaultValue={`
function () {
}
                        `}
                        onChange={(value: (string|undefined), event: any) => {setScriptText(value ?? "");}}

                    />
                </div>
                <div className="card-footer d-flex justify-content-end py-1" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                    <button className="btn zbtn btn-sm py-1 px-2" style={{fontSize: "11px"}} onClick={() => {onExit(scriptText)}}>Ok</button>
                </div>
            </div>
        </div>
    );
}

export default ScriptEditor;
