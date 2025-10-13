import React, { useCallback, useContext, useEffect, useState } from "react";
import BuilderPage from "../Components/FlowBuilder/BuilderPage";
import {
	ReactFlowProvider,
	addEdge,
	Background,
	Controls,
	Node,
	Edge,
	Connection,
	useNodesState,
	useEdgesState,
	ReactFlow
} from "@xyflow/react";
import FieldTypes from "../Enums/FiedTypes";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AuthContext from "../Contexts/AuthContext";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";
import { Authorized } from "../APIs/api";
import TriggerNodeForm from "../Components/FlowBuilder/ActionForms/TriggerNodeForm";
import RecordActionFrom from "../Components/FlowBuilder/ActionForms/RecordActionForm";
import SubFlowForm from "../Components/FlowBuilder/ActionForms/SubFlowForm";
import DecisionActionForm from "../Components/FlowBuilder/ActionForms/DecisionActionForm";
import AdvancedActionForm from "../Components/FlowBuilder/ActionForms/AdvancedActionForm";
import ForEachLoopActionForm from "../Components/FlowBuilder/ActionForms/ForEachLoopActionForm";
import OptionConditionBuilder from "../Components/FlowBuilder/OptionConditionBuilder";
import EditNoteIcon from '@mui/icons-material/EditNote';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import QueryBuilder from "../Components/Reusables/QueryBuilder";
import DynamicKeyValueForm from "../Components/Reusables/DynamicKeyValueForm";
import DataObjectIcon from '@mui/icons-material/DataObject';
import ScriptEditor from "../Components/Reusables/ScriptEditor";
import BasicConditionBuilder from "../Components/FlowBuilder/BasicConditionBuilder";
import UpdateVariableForm from "../Components/FlowBuilder/ActionForms/UpdateVariableForm";

interface CurrentPageProps {
	routeData: any;
	dataPassed: any;
	mainNavigation: () => void;
	updatePageTitle: (title: string) => void;
	loadComponent?: (page: string) => React.ReactNode;
}

const FlowBuilder: React.FC<CurrentPageProps> = ({
	routeData,
	dataPassed,
	mainNavigation,
	updatePageTitle,
}) => {

	const flowRef = React.useRef<any>(null);
	const {loggedUser, cookies, localData, forms} = useContext(AuthContext);
	const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [flowRecord, setFlowRecord] = useState<any>();
	const [localWaiting, setLocalWaiting] = useState(false);
	const [triggerNode, setTriggerNode] = useState<any>({
      "id": "trigger",
      "position": {
        "x": 499.8854776227521,
        "y": 236
      },
      "type": "triggerNode",
      "data": {
        "label": "Trigger",
        "internalName": "trigger",
        "description": "",

		"triggerType": "record_based", // record_based, time_based, one_time, manual
        "actionType": "advanced", // advanced, normal
        "reccurrence": "none", // only for time based triggers
        "given_datetime": "", // only for time based triggers
        "condition": [], // only for record based triggers
        "table_id": "", // only for record based triggers
	
        "type": "triggerNode",
        "next": ""
      },
      "selected": false,
      "measured": {
        "width": 400,
        "height": 100
      }
    });
	const [nodes, setNodes] = useState<any[]>([]);
	const [edges, setEdges] = useState<any[]>([]);
	const [selectedNode, setSelectedNode] = useState<any>({
		id: "",
		label: "",
		internalName: "",
		description: "",
		type: "defaultNode",
		options: [],
	});
	
	const onSelectionChange = useCallback((params: { nodes: Node[] }) => {
		console.log("Selected node:", params.nodes);
		if (params.nodes[0] && params.nodes[0].data) {
			setSelectedNode((prev: any) => ({ ...prev, ...params.nodes[0].data }));
			setNodes((prev: any) => (prev.map((prv: any) => {
				if (prv.id == params.nodes[0].id) {
					return { ...prv, data: { ...params.nodes[0].data, is_selected: true } };
				} else {
					return { ...prv, data: { ...prv.data, is_selected: false } };
				}
			})));
			setIsCreate(false);
		}
	}, []);

	React.useEffect(() => {
		handleLoad();
	}, [routeData.params.id]);

	const handleLoad = async () => {

		setTimeout(() => {setLocalWaiting(true);}, 10);

		try {


			// const saved = localStorage.getItem("flowData");
			if(routeData.params.id && routeData.params.id != "-1") {

				let result = await MainAPI.getSingle(cookies.login_token, "flow_defination", routeData.params.id);
				let flow_specs = JSON.parse(result.specification);
				let final_nodes = [flow_specs.trigger, ...flow_specs.actions];

				setFlowRecord(result);
				setTriggerNode(flow_specs.trigger);
				setNodes(final_nodes);
				setEdges(getEdges(final_nodes));

				updatePageTitle(result.name);

			} else {
				updatePageTitle("Unknow Flow!");
			}

		} catch(error) {
			setAlert(error.message, "error");
		}

		setTimeout(() => {setLocalWaiting(false);}, 10);

	};

	const handleCreateNode = async (nodeData: any) => {

		setTimeout(() => {setLocalWaiting(true);}, 10);

		try {

			nodeData.internalName = nodeData.internalName.trim();
			if (!nodeData.internalName || nodeData.internalName == "") {
				throw new Error("Please provide a valid internal name for the node.");
			}

			if (nodes.find(n => n.id == nodeData.internalName)) {
				throw new Error("A node with this internal name already exists. Please choose a different internal name.");
			}

			if (nodeData.internalName == "trigger") {
				throw new Error("The internal name 'trigger' is reserved for the trigger node. Please choose a different internal name.");
			}

			if(["trigger", "advanced"].includes(nodeData.type)) {
				await saveNodeScript(nodeData.internalName, nodeData.script);
			}

			if(["forLoop", "forEachLoop", "whileLoop"].includes(nodeData.type)) {
				if(!nodeData.nextRepeat) {
					nodeData.nextRepeat = "";
				}
				if(!nodeData.loopStart) {
					nodeData.loopStart = "";
				}
				setNodes((prev: any[]) => ([...prev.map((prv: any) => ({ ...prv, data: { ...prv.data, is_selected: false } })), {
					id: nodeData.internalName,
					position: { x: 0, y: 0 },
					type: nodeData.type,
					data: {
						...nodeData
					}
				}, {
					id: `${nodeData.internalName}_loop_end`,
					position: { x: 0, y: 400 },
					type: "loopEnd",
					data: {
						id: `${nodeData.internalName}_loop_end`,
						label: `${nodeData.label} Loop End`,
						internalName: `${nodeData.internalName}_loop_end`,
						description: "",
						type: "loopEnd",
						options: [],
						next: nodeData.internalName
					}
				}]));
			} else {
				setNodes((prev: any[]) => ([...prev.map((prv: any) => ({ ...prv, data: { ...prv.data, is_selected: false } })), {
					id: nodeData.internalName,
					position: { x: 0, y: 0 },
					type: nodeData.type,
					data: {
						...nodeData
					}
				}]));
			}


			setSelectedNode({
				...nodeData
			});

			setEdges(getEdges([...nodes, {
					id: nodeData.internalName,
					position: { x: 0, y: 0 },
					type: nodeData.type,
					data: {
						...nodeData
					}
				}, {
					id: `${nodeData.internalName}_loop_end`,
					position: { x: 0, y: 400 },
					type: "loopEnd",
					data: {
						id: `${nodeData.internalName}_loop_end`,
						label: `${nodeData.label} Loop End`,
						internalName: `${nodeData.internalName}_loop_end`,
						description: "",
						type: "loopEnd",
						options: [],
						next: nodeData.internalName
					}
				}]));
			setIsCreate(false);

		} catch(error) {
			setAlert(error.message, "error");
		}

		setTimeout(() => {setLocalWaiting(false);}, 10);

	};

	const updateNode = async (nodeData: any) => {

		setTimeout(() => {setLocalWaiting(true);}, 10);

		let allNodes = nodes.map((prv: any) => {
			if (prv.id == nodeData.internalName) {
				return {
					id: nodeData.internalName,
					position: prv.position,
					type: nodeData.type,
					data: {
						...nodeData,
						is_selected: true,
					}
				};
			} else {
				return { ...prv, data: { ...prv.data, is_selected: false } };
			}
		});

		if(nodeData.internalName == "trigger") {
			await saveNodeScript(nodeData.internalName, nodeData.script);
			setTriggerNode((prv: any) => ({
				...prv,
				data: nodeData
			}));
		}

		if(nodeData.type == "advanced") {
			await saveNodeScript(nodeData.internalName, nodeData.script);
		}

		setNodes(allNodes);
		setEdges(getEdges(allNodes));

		setTimeout(() => {setLocalWaiting(false);}, 10);

	}

	const deleteNode = async (nodeData: any) => {

		setTimeout(() => {setLocalWaiting(true);}, 10);

		let allNodes = nodes.filter((prv: any) => (prv.id != nodeData.internalName));

		setNodes(allNodes);
		setEdges(getEdges(allNodes));

		setTimeout(() => {setLocalWaiting(false);}, 10);

	}

	const getEdges = (allNodes: any[]) => {
		let edges = [];

		let triggerNode = allNodes.find(n => n.type == "triggerNode");
		if (triggerNode) {
			edges.push({
				id: `trigger-${triggerNode.data.next}`,
				source: triggerNode.id,
				target: triggerNode.data.next,
				type: "step",
				sourceHandle: `trigger-${triggerNode.data.next}`
			});
		}

		for (let node of allNodes) {
			if (node.data.type == "decisionNode") {
				for (let opt_idx in node.data.options) {
					edges.push({
						id: `${node.id}-${node.data.options[opt_idx].next}`,
						source: node.id,
						target: node.data.options[opt_idx].next,
						type: "step",
						sourceHandle: `${node.id}-${node.data.options[opt_idx].next}`
					});
				}
				if (node.data.next) {
					edges.push({
						id: `${node.id}-${node.data.next}`,
						source: node.id,
						target: node.data.next,
						type: "step",
						sourceHandle: `${node.id}-${node.data.next}`
					});
				}
			} else if (node.data.type == "loopEnd" && node.data.next) {
				edges.push({
					id: `${node.id}-${node.data.next}`,
					source: node.id,
					target: node.data.next,
					type: "step",
					sourceHandle: `${node.id}-${node.data.next}`,
					targetHandle: `next_repeat_${node.data.next}`,
					style: { stroke: "orage" }
				});
			} else if (["forLoop", "forEachLoop", "whileLoop"].includes(node.data.type) && node.data.loopStart) {
				edges.push({
					id: `loop_starting_${node.id}-${node.data.loopStart}`,
					source: node.id,
					target: node.data.loopStart,
					type: "step",
					sourceHandle: `loop_start_${node.id}`
				});
				if (node.data.next) {
					edges.push({
						id: `${node.id}-${node.data.next}`,
						source: node.id,
						target: node.data.next,
						type: "step",
						sourceHandle: `${node.id}-${node.data.next}`
					});
				}
			} else if (node.data.next) {
				edges.push({
					id: `${node.id}-${node.data.next}`,
					source: node.id,
					target: node.data.next,
					type: "step",
					sourceHandle: `${node.id}-${node.data.next}`
				});
			}
		};
		return edges;
	}

	const updateInput = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
		if (type == FieldTypes.FLOAT) {
			setSelectedNode((flds: any) => ({ ...flds, [field_name]: parseFloat(value) }));
		} else if (type == FieldTypes.NUMBER) {
			setSelectedNode((flds: any) => ({ ...flds, [field_name]: parseInt(value) }));
		} else {
			setSelectedNode((flds: any) => ({ ...flds, [field_name]: value }));
		}
	}

	const onFlowChange = (newFlow: any) => {

		setNodes(newFlow.nodes);
		setEdges(newFlow.edges);

		let trgNode = newFlow.nodes.find((n: any) => n.type == "triggerNode");
		if (trgNode) {
			setTriggerNode(trgNode);
		}

	};

	const handleSave = async () => {

		setTimeout(() => {setLocalWaiting(true);}, 10);

		try {

			// const flowData = { nodes, edges };
			// localStorage.setItem("flowData", JSON.stringify(flowData));
			let flow_trigger = nodes.find((nd: any) => (nd.type == 'triggerNode'));
			let flow_actions = nodes.filter((nd: any) => (nd.type != 'triggerNode'));

			await MainAPI.update(cookies.login_token, "flow_defination", {
				...flowRecord,
				specification: JSON.stringify({
					trigger: flow_trigger,
					actions: flow_actions
				})
			});

			setAlert("Flow Saved!", "success");

		} catch(error) {
			console.log(error);
			setAlert(error.message, "error");
		}

		setTimeout(() => {setLocalWaiting(false);}, 10);

	};

	const saveNodeScript = async (action_name: string, script: string) => {

		try {

			if(action_name && script) {
				await Authorized(cookies.login_token).bodyRequest("post", "scripts/flow/action_script/update", {
					flow_id: flowRecord.sys_id,
					action_name,
					script
				});
			}

		} catch(error) {
			console.log(error);
			setAlert(error.message, "error");
		}

	}

	return (
		<div className="row m-0 h-100 p-0">
			{/* Left Panel - Flow Builder */}
			<div className="col-8" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
				<div className="h-100 border-1 zpanel" style={{ position: "relative" }}>
					<BuilderPage
						initialFlow={{ nodes, edges }}
						edgeColor="blue"
						onSelectionChange={onSelectionChange}
						onFlowChange={onFlowChange}
					/>
					<div className="p-2 bg-transparent" style={{ height: "max-content", position: "absolute", top: 0, left: 0 }}>
						<button className="btn btn-sm me-2 zbtn" onClick={handleSave}>
							Save Flow
						</button>
					</div>
				</div>
			</div>

			{/* Right Sidebar */}
			<div className="col-4 zpanel p-0" style={{ height: "100%", overflowY: "auto" }}>
				<div className="d-flex justify-content-between align-items-start zpanel border-bottom px-3 py-2">
					<h4 className="h4">Actions & Forms</h4>
					<div className="btn-group">
						{(!isCreate && selectedNode.internalName != "") && (
							<button className="btn btn-sm zbtn" onClick={async () => { await updateNode(selectedNode) }}>
								Save <SaveAsIcon sx={{ fontSize: 19 }} />
							</button>
						)}
						{(isCreate) && (
							<button className="btn btn-sm zbtn" onClick={async () => { await handleCreateNode(selectedNode) }}>
								Create <SaveAsIcon sx={{ fontSize: 19 }} />
							</button>
						)}
						{(!isCreate && selectedNode.internalName != "") && (
							<button className="btn btn-danger btn-sm" onClick={() => {deleteNode(selectedNode)}}>
								Delete <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
							</button>
						)}
						{(selectedNode.internalName != "") && (
							<button
								className="btn btn-danger btn-sm"
								onClick={() => {
									setSelectedNode({
										id: "",
										label: "",
										internalName: "",
										description: "",
										type: "defaultNode",
										options: [],
									});
									setIsCreate(true);
								}}
							>
								Clear <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
							</button>
						)}
					</div>
				</div>

				<div className="p-3 zpanel">

					<div className="mb-3">
						<label className="form-label">Label</label>
						<input className="form-control form-control-sm zinput" value={selectedNode.label} type="text" onChange={(e) => updateInput("label", e.target.value)} />
					</div>
					<div className="mb-3">
						<label className="form-label">Internal Name</label>
						<input className="form-control form-control-sm zinput" value={selectedNode.internalName} type="text" onChange={(e) => updateInput("internalName", e.target.value)} />
					</div>
					<div className="mb-3">
						<label className="form-label">Type</label>
						<select 
							className="form-control form-control-sm zinput" 
							value={selectedNode.type} 
							onChange={(e) => {
								updateInput("type", e.target.value);
								if(e.target.value == "advanced") {
									updateInput("script", `
// flow script defination
/**
 * this function will be called when the flow is triggered.
 * @param {string} process_id process record sys_id
 * @param {FlowActions} actions actions object to perform actions on the process
 * @param {any} optionalData optional data passed to the script
 */
module.exports = async function(process_id, actions, optionalData) {

	// script content will go here

	await actions.delay(60000);
	await actions.changeProcessState("completed");
	optionalData.dependencies.logger("////////////////////////////////////////////////////////////// flow completed");

};`
									);
								}
							}}
							disabled={selectedNode.internalName == "trigger" || selectedNode.type == "loopEnd"}
						>
							<option value="defaultNode">Default</option>
							<option value="getSingle">Get Single</option>
							<option value="fetchMultiple">Fetch Multiple</option>
							<option value="createRecord">Create Record</option>
							<option value="updateRecord">Update Record</option>
							<option value="deleteRecord">Delete Record</option>
							<option value="decisionNode">Decision</option>
							<option value="forEachLoop">For Each Loop</option>
							<option value="forLoop">For Loop</option>
							<option value="whileLoop">While Loop</option>
							<option value="advanced">Advanced</option>
							<option value="callSubFlow">SubFlow</option>
							<option value="setVariable">Set Variable</option>
							<option value="setOutPut">Set OutPut Data</option>
							{
								selectedNode.internalName == "trigger" && (
									<option value="triggerNode">Trigger</option>
								)
							}
							{
								selectedNode.type == "loopEnd" && (
									<option value="loopEnd">End Of Loop</option>
								)
							}
						</select>
					</div>
					<div className="mb-3">
						<label className="form-label">Description</label>
						<textarea className="form-control form-control-sm zinput" value={selectedNode.description} onChange={(e) => updateInput("description", e.target.value)}></textarea>
					</div>

					{
						(selectedNode.type == "triggerNode") && (
							<TriggerNodeForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						(selectedNode.type == "callSubFlow") && (
							<SubFlowForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						["getSingle", "fetchMultiple", "createRecord", "updateRecord", "deleteRecord"].includes(selectedNode.type) && (
							<RecordActionFrom selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						(selectedNode.type == "advanced") && (
							<AdvancedActionForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						(selectedNode.type == "decisionNode") && (
							<DecisionActionForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						["forEachLoop", "whileLoop"].includes(selectedNode.type) && (
							<ForEachLoopActionForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						["setVariable", "setOutPut"].includes(selectedNode.type) && (
							<UpdateVariableForm selectedNode={selectedNode} updateInput={updateInput} nodes={nodes} />
						)
					}

					{
						selectedNode.type == "loopEnd" && (
							<div className="w-100">
								<h5 className="h5 mb-3"> Next Action </h5>
								<select
									className="form-control form-control-sm zinput"
									value={selectedNode.next}
									onChange={(e) => updateInput("next", e.target.value)}
									disabled={selectedNode.type == "loopEnd"}
								>
									<option value="">Select Next Action</option>
									{nodes.map((n) => (
										<option key={n.id} value={n.id}>
											{n.data.label}
										</option>
									))}
								</select>
							</div>
						)
					}

				</div>
			</div>

			{
                (localWaiting) && (
                    <div className="waiting-container">
                        <div className="card zpanel rounded-5" style={{width: "max-content", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)"}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <div className="spinner-border" style={{color: "var(--text_color)"}} role="status">
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

export default FlowBuilder;
