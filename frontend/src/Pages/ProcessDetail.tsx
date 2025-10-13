import React, { useContext, useEffect, useState } from "react";
import ReactJson from "react-json-view"; // for beautified JSON viewer
import AuthContext from "../Contexts/AuthContext";
import { Authorized } from "../APIs/api";

interface CurrentPageProps {
    routeData: any;
    dataPassed: any;
    mainNavigation: () => void;
    updatePageTitle: (title: string) => void;
    loadComponent?: (page: string) => React.ReactNode;
}

const ProcessDetail: React.FC<CurrentPageProps> = ({
    routeData,
    dataPassed,
    mainNavigation,
    updatePageTitle,
}) => {

    const { forms, cookies } = useContext(AuthContext);

    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch flow specification
    useEffect(() => {
        if (!routeData.params.id) return;
        loadData();
    }, [routeData.params.id]);

    const loadData = async () => {
        setError(null);
        try {
            if(routeData.params.id && routeData.params.id != "-1") {
                const execution_result = await Authorized(cookies.login_token).bodyRequest("get", `flow/process_data?id=${routeData.params.id}`, {});
                setResult(execution_result);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container-fluid py-4 zpanel">
            <h3 className="card-title fs-2 mb-2">Process Detail</h3>

            {/* Error */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* JSON Viewer */}
            <div style={{ minHeight: "400px" }} className="border rounded p-2">
                {result ? (
                    <ReactJson
                        src={result}
                        theme="monokai"
                        collapsed={false}
                        enableClipboard={true}
                        displayDataTypes={false}
                    />
                ) : (
                    <p className="text-muted">Execution result will appear here.</p>
                )}
            </div>
        </div>
    );
};

export default ProcessDetail;
