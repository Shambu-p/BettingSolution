import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactJson from "react-json-view"; // for beautified JSON viewer
import AuthContext from "../Contexts/AuthContext";
import { Authorized } from "../APIs/api";
import { Editor, useMonaco, OnMount } from "@monaco-editor/react";
import ZThemeContext from "../Contexts/ZThemeContext";
import AlertContext from "../Contexts/AlertContext";
import Pages from "./Pages";
import MainAPI from "../APIs/MainAPI";

interface CurrentPageProps {
    routeData: any;
    dataPassed: any;
    mainNavigation: () => void;
    updatePageTitle: (title: string) => void;
    loadComponent?: (page: string) => React.ReactNode;
}

const PageBuilder: React.FC<CurrentPageProps> = ({
    routeData,
    dataPassed,
    mainNavigation,
    updatePageTitle,
}) => {

    // const monaco = useMonaco();
    const { forms, cookies } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);
    const { theme } = useContext(ZThemeContext);

    const [result, setResult] = useState<any | null>(null);
    const [viewEditor, setViewEditor] = useState<boolean>(true);
    const [scriptText, setScriptText] = useState<string>("");

    // Fetch flow specification
    useEffect(() => {
        if (!routeData.params.id) return;
        loadData();
    }, [routeData.params.id]);


    const loadData = async () => {
        try {
            if (routeData.params.id && routeData.params.id != "-1") {
                const execution_result = await MainAPI.getSingle(cookies.login_token, "ui_component", routeData.params.id);
                setResult(execution_result);
                setScriptText(execution_result.component_script ?? "");
            }
        } catch (err: any) {
            setAlert(err.message, "error");
        }
    };

    const saveComponent = async () => {
        try {
            if (routeData.params.id && routeData.params.id != "-1") {
                const execution_result = await MainAPI.update(cookies.login_token, "ui_component", { ...result, component_script: scriptText, updater: undefined, creater: undefined });
                setResult(execution_result);
            }
        } catch (err: any) {
            setAlert(err.message, "error");
        }
    };

    const handleEditorDidMount: OnMount = useCallback(async (editor, monaco) => {
        // --- 1) Configure compiler options for TS/TSX ---
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            // Choose ReactJSX for React 17+ with the new JSX transform,
            // or use JsxEmit.React for older transforms if needed.
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            allowJs: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            noImplicitAny: false,
            // include DOM lib so intrinsic elements types exist:
            lib: ["es2020", "dom"],
        });

        // --- 2) Ensure model uses .tsx semantics by giving it a .tsx URI and language ---
        // Create a model with a .tsx uri so Monaco's TS worker treats it as TSX
        const uri = monaco.Uri.parse("file://model.tsx");
        monaco.editor.createModel(scriptText, "typescript", uri);
        // const existing = monaco.editor.getModel(uri);
        // if (!existing) {
        // }
        const model = monaco.editor.getModel(uri);
        if (model) editor.setModel(model);

        // --- 3) Inject React type definitions into Monaco ---
        // (You can cache these strings on your server or bundle them if you can't use unpkg)
        async function addReactTypes() {
            try {
                // fetch @types/react
                const reactDT = await fetch(
                    "https://unpkg.com/@types/react@18.0.28/index.d.ts"
                ).then((r) => r.text());
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    reactDT,
                    "file:///node_modules/@types/react/index.d.ts"
                );

                // fetch @types/react-jsx-runtime (for new JSX runtime) — optional but helpful
                try {
                    const jsxRuntimeDT = await fetch(
                        "https://unpkg.com/@types/react@18.0.28/jsx-runtime.d.ts"
                    ).then((r) => r.text());
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(
                        jsxRuntimeDT,
                        "file:///node_modules/@types/react/jsx-runtime.d.ts"
                    );
                } catch (_) {
                    // ignore if not present
                }

                // fetch @types/react-dom (some projects rely on these types)
                const reactDomDT = await fetch(
                    "https://unpkg.com/@types/react-dom@18.0.11/index.d.ts"
                ).then((r) => r.text());
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    reactDomDT,
                    "file:///node_modules/@types/react-dom/index.d.ts"
                );
            } catch (err) {
                // network failure — warn in console
                // In production you'd want to load local copies instead.
                // eslint-disable-next-line no-console
                console.warn("Could not load @types/react from CDN:", err);
            }
        }

        addReactTypes();

        // Optional: add any project-specific custom d.ts to expose globals/types
        // monaco.languages.typescript.typescriptDefaults.addExtraLib(
        //   'declare module "my-lib" { export function foo(): void }',
        //   "file:///node_modules/@types/custom/index.d.ts"
        // );

        // Optional: adjust diagnostics/settings
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
        });
    }, [scriptText]);



    return result && (
        <div className="zpanel h-100">
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom" style={{ backgroundColor: "rgba(125, 125, 125, 0.074)" }}>
                <h3 className="card-title fs-5 m-0">{result.name}</h3>
                <div className="d-flex w-auto">
                    <button className="btn zbtn btn-sm me-2" onClick={() => setViewEditor(!viewEditor)}>{viewEditor ? "Close Editor" : "Open Editor"}</button>
                    <button className="btn zbtn btn-sm" onClick={saveComponent}>Save</button>
                </div>
            </div>

            <div className="d-flex h-100">
                <div className="col h-100" style={{ background: "var(--main_bg)" }}>
                    <Pages page={routeData.params.id} parentType="main_ui" routeData={{}} dataPassed={{}} />
                </div>
                {viewEditor && (
                    <div className="col-5 h-100 border-start">
                        <Editor
                            height="100%"
                            width="100%"
                            theme={theme.scheme == "zdark" ? "vs-dark" : "vs-light"}
                            // defaultLanguage="typescript"
                            onMount={handleEditorDidMount}
                            // beforeMount={handleEditorWillMount}
                            // value={scriptText}
                            defaultValue={`
    function () {
    }
                            `}
                            onChange={(value: (string | undefined), event: any) => { setScriptText(value ?? ""); }}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default PageBuilder;
