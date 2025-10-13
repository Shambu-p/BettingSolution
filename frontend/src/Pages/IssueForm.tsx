import React, { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FieldTypes from "../Enums/FiedTypes";
import Utils from "../Models/Utils";
import FormAttachment from "../Components/Reusables/FormAttachment";
import UserRoles from "../Enums/UserRoles";
import RecordActivity from "../Components/Reusables/RecordActivity";
import TransactionCategory from "../Enums/TransactionCategory";
import TransactionType from "../Enums/TransactionType";
import Operators from "../Enums/Operators";


const IssueForm = (props: any) => {

    const { loggedUser, cookies, localData } = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu, setPopUp } = useContext(AlertContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [finishedProducts, setFinishedProducts] = useState<any[]>([]);
    const [consumptions, setConsumptions] = useState<any[]>([]);
    const [finishedProductInputs, setFinishedProductInputs] = useState<any>({
        product_id: "",
        quantity: ""
    });
    const [consumptionInputs, setConsumptionInputs] = useState<any>({
        item_id: "",
        quantity: 0
    });
    const [selectData, setSelectData] = useState<any>({
        products: [],
        stores: [],
        managerUsers: [],
        inventoryItems: []
    });
    const [localWaiting, setLocalWaiting] = useState(false);
    const [infoFields, setInfoFields] = useState<any>({
        issue_number: "",
        subject: "",
        description: "",
        type: "",
        resolution_note: "",
        started_on: "",
        resolved_on: "",
        immediate_image: "",
        status: "new"
    });

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    useEffect(() => {
        setInfoFields((prev: any) => ({...prev, immediate_image: props.dataPassed.immediate_image}));
    }, [props.dataPassed]);

    useEffect(() => {
        loadInventoryItems();
    }, [infoFields.store_id]);

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == column));
        if (!found_choice) {
            return {};
        }

        return found_choice;
    }

    const loadData = async () => {

        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {

            if (props.routeData.params.id && props.routeData.params.id != "-1") {
                let result = await MainAPI.getSingle(cookies.login_token, "issue_ticket", props.routeData.params.id, "reference");

                setInfoFields({
                    ...result
                });
                props.updatePageTitle(result.issue_number);

            } else {
                props.updatePageTitle("New Issue Form");
            }

        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);

    }

    const loadSelectData = async () => {

        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {

            let temp_data = {
                products: [],
                inventoryItems: [],
                stores: [],
                managerUsers: [],
            };

            // temp_data.products = (await MainAPI.getAll(cookies.login_token, "product", 0, 0, {})).Items;
            // temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;
            // temp_data.inventoryItems = (await MainAPI.getAll(cookies.login_token, "inventory_item", 0, 0, {})).Items;
            // temp_data.managerUsers = (await MainAPI.getAll(cookies.login_token, "user", 0, 0, {})).Items;

            setSelectData(temp_data);

        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);

    }

    const loadInventoryItems = async () => {

        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {
            let store_products = (await MainAPI.getAll(cookies.login_token, "store_item", 0, 0, {
                store_id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: infoFields.store_id
                },
            }, "reference")).Items;
            setSelectData((prev: any) => ({ ...prev, inventoryItems: store_products.map((prd: any) => ({ ...prd.inventoryItem, quantity: prd.quantity })) }));
        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);

    }

    const updateInfoFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if ([FieldTypes.DATETIME, FieldTypes.DATE].includes(type)) {
            setConsumptionInputs((flds: any) => ({ ...flds, [field_name]: (new Date(value)).toISOString() }));
        } else if (type == FieldTypes.NUMBER) {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: parseInt(value) ?? 0 }));
        } else {
            setInfoFields((flds: any) => ({ ...flds, [field_name]: value }));
        }
    }

    const formSubmit = async () => {

        console.log("called ......");

        setTimeout(() => { setLocalWaiting(true); }, 10);
        try {

            if (!props.routeData.params.id || props.routeData.params.id == "-1") {

                let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "issue_ticket", {
                    ...infoFields,
                    // started_on: Utils.dateToISO(infoFields.started_on),
                    // finished_on: Utils.dateToISO(infoFields.finished_on)
                });

                props.mainNavigation({
                    id: `/issue-form/${parent_result.sys_id}`,
                    title: "Loading...",
                    type: "page",
                    table: "",
                    rec_id: "",
                    dashboard_id: "issue-form",
                    data: {
                        routeData: {
                            params: {
                                id: parent_result.sys_id
                            }
                        },
                        dataPassed: {}
                    }
                });

            } else if (props.routeData.params.id) {
                let result = await MainAPI.update(cookies.login_token, "issue_ticket", {
                    ...infoFields,
                    creater: undefined,
                    updater: undefined
                    // started_on: Utils.dateToISO(infoFields.started_on),
                    // finished_on: Utils.dateToISO(infoFields.finished_on)
                });
            }

            if(props.routeData.is_popup) {
                setPopUp(false)
            }

        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => { setLocalWaiting(false); }, 10);

    }


    return (
        <div className="row m-0 h-100 py-3" >
            <div className={props.routeData.is_popup ? "col-12 h-100" : "col-6 h-100"} style={{ overflow: "hidden auto" }}>

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3">{(props.routeData.params.id && props.routeData.params.id != "-1") ? infoFields.issue_number : "New Issue"}</div>
                            <div className="btn-group">
                                <button className="btn btn-secondary btn-sm px-3" type="button">
                                    {getDisplaySelect("issue_ticket.status", infoFields.status).label ?? "New"}
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        (["new"].includes(infoFields.status) && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin])) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => { setTimeout(() => { updateInfoFields("status", "inprogress", FieldTypes.TEXT) }, 10) }}>Work In Progress</button>
                                            </li>
                                        )
                                    }
                                    {
                                        (["inprogress",].includes(infoFields.status) && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin])) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => { setTimeout(() => { updateInfoFields("status", "waiting_confirmation", FieldTypes.TEXT) }, 10) }}>Waiting Client Confirmation</button>
                                            </li>
                                        )
                                    }

                                    {
                                        (["waiting_confirmation"].includes(infoFields.status) && (!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) || infoFields.created_by == loggedUser.sys_id)) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => { setTimeout(() => { updateInfoFields("status", "resolved", FieldTypes.TEXT) }, 10) }}>Resolved</button>
                                            </li>
                                        )
                                    }

                                </ul>
                                <button className="btn btn-sm btn-dark" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <i
                                        className="bx bx-refresh"
                                        style={{ fontSize: '20px', transform: `translateY(10%)` }}
                                        onClick={async () => {
                                            await loadData();
                                            await loadSelectData();
                                        }}
                                    />
                                </button>
                            </div>
                            {/* <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div> */}
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <div>Posted By: {infoFields.creater ? infoFields.creater.full_name : "Not Set"}</div>
                            <div>Resolved By: Not set</div>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <div>Posted On {infoFields.created_on ? Utils.isoToReadableDateTime(infoFields.created_on, localData.dateConfig) : "Not Set"}</div>
                            <div>Resolved On {infoFields.finished_on ? Utils.isoToReadableDateTime(infoFields.finished_on, localData.dateConfig) : "Not Set"}</div>
                        </div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{ fontSize: '20px' }}></i>
                        <input className="form-control zinput mx-2 border-0 py-1" placeholder="Subject/Short Description" value={infoFields.subject} onChange={(event: any) => { updateInfoFields("subject", event.target.value) }} />
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-user-pin" style={{ fontSize: '20px' }}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={infoFields.type} onChange={(event: any) => { updateInfoFields("type", event.target.value) }} >
                            <option value="">Problem Type</option>
                            <option value="bug">Bug/Error</option>
                            <option value="support">Support</option>
                            <option value="new_req">New Requirement</option>
                        </select>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="mb-2">Issue Description</div>
                    <textarea
                        className="form-control zinput border-0 py-1"
                        value={infoFields.description}
                        onChange={(event: any) => { updateInfoFields("description", event.target.value) }}
                        placeholder="Issue Description"
                    />
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    {/* <div className="search-bar d-flex justify-content-between align-items-center">
                        <MoneyOffIcon style={{fontSize: '20px'}} />
                    </div> */}
                    <div className="mb-2">Resolution Note</div>
                    <textarea
                        className="form-control zinput border-0 py-1"
                        value={infoFields.resolution_note}
                        onChange={(event: any) => { updateInfoFields("resolution_note", event.target.value) }}
                        placeholder="Resolution Note"
                    />
                </div>

                <img src={infoFields.immediate_image} alt="issue_image" style={{width: "400px"}} />
                

                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn zbtn my-2" onClick={formSubmit}>
                        {((props.routeData.params.id && props.routeData.params.id != "-1") ? "Update" : "Submit")}
                    </button>
                </div>

            </div>
            {
                !props.routeData.is_popup && (
                    <div className="col mx-1 zpanel rounded-top-3 shadow-sm h-100" style={{ overflow: "hidden auto" }}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1") && (
                                <RecordActivity tableName="issue_ticket" recordId={props.routeData.params.id} />
                            )
                        }
                    </div>
                )
            }
            {
                !props.routeData.is_popup && (
                    <div className="col mx-1 zpanel p-0 rounded-top-3 shadow-sm" style={{ overflow: "hidden auto" }}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.BranchManager])) ? (
                                <FormAttachment tableName="issue_ticket" recordId={props.routeData.params.id} canAddAttachment={props.routeData.params.id == "-1" ? [] : [UserRoles.Admin]} />
                            ) : (
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">No Permission For Attachments</h4>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
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

export default IssueForm;