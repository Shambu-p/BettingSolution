// EndpointDesigner.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import { Authorized } from "../APIs/api";
import ScriptEditor from "../Components/Reusables/ScriptEditor";
import ZThemeContext from "../Contexts/ZThemeContext";
import Editor from '@monaco-editor/react';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type EndpointType =
    | "create"
    | "update"
    | "delete"
    | "fetch"
    | "fetch_many"
    | "advanced";

export interface EndpointMeta {
    sys_id: string | number;
    route: string;
    method: HttpMethod;
    type: EndpointType;
    table_name: string;
    apiUser: any;
}

interface EndpointDesignerProps {
    endpoint: EndpointMeta;
    allFields: string[];
    onSave: (payload: EndpointMeta & {
        allowedFieldsJson: string;
        conditionsJson: string;
    }) => void;
    onCancel?: () => void;
}

const EndpointDesigner: React.FC<EndpointDesignerProps> = (props: any) => {

    const { loggedUser, cookies, localData, forms } = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu, setPopUp } = useContext(AlertContext);
    const {theme} = useContext(ZThemeContext);
    // Entire record in one state
    const [record, setRecord] = useState<EndpointMeta>();
    const [allowedFields, setAllowedFields] = useState<string[]>([]);
    const [conditions, setConditions] = useState<any>({});
    const [allFields, setAllFields] = useState<any[]>([]);
    const [localWaiting, setLocalWaiting] = useState(false);
    const [script, setScript] = useState({
        Visibility: false,
        content: ""
    });
    // ---- Allowed fields ----
    const [search, setSearch] = useState("");


    const filteredFields = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? allFields.filter((f: any) => (f.id.toLowerCase().includes(q) && f.label.toLowerCase().includes(q))) : allFields;
    }, [allFields, search]);

    const loadData = async () => {

        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {

            if (props.routeData.params.id && props.routeData.params.id != "-1") {
                let result = await MainAPI.getSingle(cookies.login_token, "endpoint", props.routeData.params.id, "reference");

                if(result) {
                    let endpoint_script = await Authorized(cookies.login_token).bodyRequest("get", `scripts/endpoint/get?id=${result.sys_id}`);
                    setScript(prev => ({...prev, content: endpoint_script.script}));
                }

                setRecord({
                    ...result
                });

                setAllowedFields(JSON.parse(result.fields) || []);
                setConditions(JSON.parse(result.access_conditions) || []);

                let found_table = forms.find((tbl: any) => (tbl.id == result.table_name));
                if(found_table) {
                    setAllFields(Object.values(found_table.fields));
                }

                props.updatePageTitle(result.route);

            } else {
                props.updatePageTitle("API Endpoint");
            }

        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);

    }

    const toggleOne = (field: string) =>
        setAllowedFields((prev) => (
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...(prev || []), field]
        ));

    const selectAllFiltered = () =>
        setAllowedFields((prev) => (Array.from(
                new Set([...(prev || []), ...(filteredFields.map(ffld => ffld.id))])
            )
        ));

    const clearAllFiltered = () =>
        setAllowedFields((prev) => (
            (prev || []).filter((f) => !(filteredFields.map(ffld => ffld.id)).includes(f))
        ));

    const clearAll = () =>
        setAllowedFields((prev) => ([]));

    // ---- Conditions ----
    const initialConditionsText = useMemo(
        () =>
            conditions !== undefined
                ? JSON.stringify(conditions, null, 2)
                : "{\n  \n}",
        [conditions]
    );

    const [conditionsText, setConditionsText] = useState<string>(initialConditionsText);
    const [conditionsError, setConditionsError] = useState<string | null>(null);

    const onCancel = () => {

    }

    useEffect(() => {
        try {
            JSON.parse(conditionsText);
            setConditionsError(null);
            loadData();
        } catch (e: any) {
            setConditionsError(e?.message || "Invalid JSON");
        }
    }, [conditionsText]);
    
    // ---- Save ----
    const handleSave = async () => {

        setTimeout(() => { setLocalWaiting(true); }, 10);

        let parsedConditions: any;
        try {
            parsedConditions = JSON.parse(conditionsText);
        } catch {
            setConditionsError("Please fix the JSON in Conditions before saving.");
            return;
        }

        const payload = {
            ...record,
            access_conditions: conditionsText,
            fields: JSON.stringify(allowedFields || [], null, 2)
        };

        try {

            if (props.routeData.params.id && props.routeData.params.id != "-1") {
                await MainAPI.update(
                    cookies.login_token,
                    "endpoint",
                    {
                        ...payload,
                        creater: undefined,
                        updater: undefined,
                        apiUser: undefined
                    }
                );

                let endpoint_script = await Authorized(cookies.login_token).bodyRequest("post", `scripts/endpoint/update`, {
                    id: record.sys_id,
                    script: script.content
                });
            } else {
                props.updatePageTitle("API Endpoint");
            }

        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => { setLocalWaiting(false); }, 10);

    };

    // ---- Badge helpers ----
    const methodBadge = (m: HttpMethod) => {
        const map: Record<HttpMethod, string> = {
            GET: "secondary",
            POST: "success",
            PUT: "warning",
            PATCH: "warning",
            DELETE: "danger",
        };
        return map[m] || "secondary";
    };

    const typeBadge = (t: EndpointType) => {
        const map: Record<EndpointType, string> = {
            create: "success",
            update: "warning",
            delete: "danger",
            fetch: "primary",
            fetch_many: "primary",
            advanced: "info",
        };
        return map[t] || "secondary";
    };

    return record && (
        <div className="container-fluid">
            {/* Header */}
            <div className="row g-3 mb-3 mt-1 align-items-center">
                <div className="col">
                    <div className="card shadow-sm zpanel">
                        <div className="card-body d-flex flex-wrap gap-3 align-items-center">
                            <div>
                                <div className="small">Route</div>
                                <div className="fw-semibold">{record.route}</div>
                            </div>
                            <div className="vr d-none d-md-block" />
                            <div>
                                <div className="small">Method</div>
                                <span
                                    className={`badge bg-${methodBadge(record.method)} fs-6`}
                                >
                                    {record.method}
                                </span>
                            </div>
                            <div className="vr d-none d-md-block" />
                            <div>
                                <div className="small">Type</div>
                                <span className={`badge bg-${typeBadge(record.type)} fs-6`}>
                                    {record.type}
                                </span>
                            </div>
                            <div className="vr d-none d-md-block" />
                            <div>
                                <div className="small">Table</div>
                                <div className="fw-semibold">{record.table_name}</div>
                            </div>
                            <div className="vr d-none d-md-block" />
                            <div>
                                <div className="small">User</div>
                                <div className="fw-semibold">{record.apiUser.user_name}</div>
                            </div>
                            {record.sys_id && (
                                <>
                                    <div className="vr d-none d-md-block" />
                                    <div>
                                        <div className="small">ID</div>
                                        <div className="fw-semibold">{record.sys_id}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {
                (record.type == "advanced") ? (

                    <div className="col-12">
                        <div className="card shadow-sm h-100 zpanel">
                            <div className="card-header fw-semibold">API Handler Script</div>
                            <div className="card-body" style={{height: "400px"}}>
                                <Editor
                                    height="100%"
                                    width="100%"
                                    theme={theme.scheme == "zdark" ? "vs-dark" : "vs-light"}
                                    defaultLanguage="javascript"
                                    value={script.content}
                                    defaultValue={`
function () {
}
                                    `}
                                    onChange={(value: (string|undefined), event: any) => {setScript(prev => ({...prev, content: value}))}}

                                />
                                {conditionsError && (
                                    <div className="invalid-feedback">{conditionsError}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                ) : (
                    <div className="row g-4">
                        {/* Allowed Fields */}
                        <div className="col-12 col-lg-6">
                            <div className="card shadow-sm h-100 zpanel">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">Allowed Fields</span>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={selectAllFiltered}
                                        >
                                            Select Visible
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={clearAllFiltered}
                                        >
                                            Clear Visible
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={clearAll}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <input
                                        type="text"
                                        className="form-control mb-3 zinput"
                                        placeholder="Search fields..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div
                                        className="border rounded p-2"
                                        style={{ maxHeight: 300, overflowY: "auto" }}
                                    >
                                        {filteredFields.map((f) => (
                                            <div className="w-100 d-flex justify-content-start align-items-center">
                                                <input
                                                    id={f.id}
                                                    className="form-check-input me-2 zcheck_box"
                                                    type="checkbox"
                                                    checked={allowedFields?.includes(f.id) || false}
                                                    onChange={() => toggleOne(f.id)}
                                                />
                                                <label
                                                    key={f.id}
                                                    className="mb-1"
                                                    htmlFor={f.id}
                                                >
                                                    {f.label} {f.required && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* <div className="mt-3">
                                        <label className="form-label">Allowed Fields JSON</label>
                                        <textarea
                                            className="form-control"
                                            rows={6}
                                            readOnly
                                            value={JSON.stringify(allowedFields || [], null, 2)}
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="col-12 col-lg-6">
                            <div className="card shadow-sm h-100 zpanel">
                                <div className="card-header fw-semibold">Conditions (JSON)</div>
                                <div className="card-body">
                                    <textarea
                                        className={`form-control zinput ${conditionsError ? "is-invalid" : ""}`}
                                        rows={16}
                                        value={conditionsText}
                                        onChange={(e) => setConditionsText(e.target.value)}
                                    />
                                    {conditionsError && (
                                        <div className="invalid-feedback">{conditionsError}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                )
            }

            {/* Actions */}
            <div className="row mt-4">
                <div className="col d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!!conditionsError}
                    >
                        Save Configuration
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
            {
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded-5" style={{ width: "max-content", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <div className="spinner-border" style={{ color: "var(--text_color)" }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default EndpointDesigner;
