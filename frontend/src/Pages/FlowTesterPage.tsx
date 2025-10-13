import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // or next/router depending on your routing
import ReactJson from "react-json-view"; // for beautified JSON viewer
import CustomeSelectBox from "../Components/Reusables/CustomeSelectBox";
import AuthContext from "../Contexts/AuthContext";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";
import { Authorized } from "../APIs/api";
import ObjectBuilderForm from "../Components/Reusables/ObjectBuilderForm";

interface CurrentPageProps {
	routeData: any;
	dataPassed: any;
	mainNavigation: () => void;
	updatePageTitle: (title: string) => void;
	loadComponent?: (page: string) => React.ReactNode;
}

interface ExecutionResult {
	[key: string]: any;
}

const FlowTesterPage: React.FC<CurrentPageProps> = ({
	routeData,
	dataPassed,
	mainNavigation,
	updatePageTitle,
}) => {

	const { forms, cookies } = useContext(AuthContext);
	const { setAlert} = useContext(AlertContext);

	const [flowSpec, setFlowSpec] = useState<any>(null);
	const [manualTriggerData, setManualTriggerData] = useState<any>(null);
	const [recordId, setRecordId] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<ExecutionResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [tableData, setTableData] = useState<any>()

	// Fetch flow specification
	useEffect(() => {
		if (!routeData.params.id) return;
		loadData();
	}, [routeData.params.id]);

	const loadData = async () => {
		try {

			if(routeData.params.id && routeData.params.id != "-1") {
				const data = await MainAPI.getSingle(cookies.login_token, "flow_defination", routeData.params.id);
				setFlowSpec(data);

				console.log(data);

				if(data.table_id) {
					let tbl_data = forms.find((frm: any) => (frm.id == data.table_id));
					setTableData(tbl_data);
				}
			}

		} catch (err: any) {
			setError(err.message);
			setAlert(err.message, "error");
		}
	};

	const handleTest = async () => {
		if (!flowSpec) return;
		if(flowSpec.initiation_type == "manual") {
			await handleSubflowTest();
		} else if(flowSpec.initiation_type == "record_based") {
			await handleRecordBasedTest();
		}
	};

	const handleRecordBasedTest = async () => {

		if (!flowSpec) return;
		setLoading(true);
		setError(null);
		try {
			const execution_result = await Authorized(cookies.login_token).bodyRequest("post", "flow/trigger_record_based_flow", {
				record_id: recordId,
				flow_id: flowSpec.sys_id,
				table_id: flowSpec.table_id,
			});
			setResult(execution_result);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}

	};

	const handleSubflowTest = async () => {

		if (!flowSpec) return;
		setLoading(true);
		setError(null);
		try {

			if(!manualTriggerData) {
				setAlert("trigger data should be set!", "error");
				return;
			}

			const execution_result = await Authorized(cookies.login_token).bodyRequest("post", "flow/trigger_sub_flow", {
				triggerData: manualTriggerData,
				flow_id: flowSpec.sys_id
			});

			setResult(execution_result);

		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}

	};

	return (
		<div className="container-fluid py-4 zpanel">
			<h3 className="card-title fs-2 mb-2">Flow Tester</h3>

			{/* Flow Spec Info */}
			{flowSpec ? (
				<div className="alert alert-info">
					<strong>Flow:</strong> {flowSpec.name} <br />
					<strong>Table ID:</strong> {flowSpec.table_id} <br/>
					<strong>Record ID:</strong> {recordId}
				</div>
			) : (
				<p className="text-muted">Loading flow specification...</p>
			)}


			<div className="d-flex justify-content-between align-items-start mb-4">
				{/* Record selector */}
				{
					(flowSpec && flowSpec.initiation_type == "manual") && (
						<div className="col-sm-12 col-md-6 col-lg-5">
							<div className="card w-100 zpanel">
								<div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
									<h6> Dynamic Object Builder </h6>
								</div>
								<div className="card-body">
								<ObjectBuilderForm
									objectData={manualTriggerData || {}}
									emit={(result) => {
										setManualTriggerData(result);
									}}
								/>
								</div>
							</div>
						</div>
					)
				}
				{
					(flowSpec && flowSpec.initiation_type == "record_based") && (
						<div className="col-sm-12 col-md-6 col-lg-3">
							<label className="form-label">Select Record</label>
							{
								(tableData ? (
									<CustomeSelectBox
										displayField={tableData.idColumn}
										givenValue={recordId}
										options={{}}
										references={flowSpec.table_id}
										token={cookies.login_token}
										onChange={async (event: any) => {
											console.log(event, "selected record");
											setRecordId(event.value);
										}}
										id="sys_id"
									/>
								) : (<label className="form-label">Table Data is not available</label>) )
							}
						</div>
					)
				}

				{/* Actions */}
				<div className="col-auto">
					<button
						className="btn btn-primary"
						disabled={loading || (!recordId && !manualTriggerData)}
						onClick={handleTest}
					>
						{loading ? "Testing..." : "Test Flow"}
					</button>
				</div>
			</div>

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

export default FlowTesterPage;
