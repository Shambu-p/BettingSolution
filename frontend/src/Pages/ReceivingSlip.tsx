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


const ReceivingSlip = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

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
        slip_number: "",
        store_id: "",
        received_by: "",
        received_on: "",
        status: "draft"
    });

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    useEffect(() => {
        loadStoreProductions();
    }, [infoFields.store_id]);

    const getDisplaySelect = (column: any, value: any) => {
        let found_choice = localData.Choices.find((ch: any) => (ch.value == value && ch.id == column));
        if(!found_choice) {
            return {};
        }

        return found_choice;
    }

    const loadData = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id && props.routeData.params.id != "-1") {
                let result = await MainAPI.getSingle(cookies.login_token, "receive_product", props.routeData.params.id, "reference");

                setInfoFields({
                    ...result
                });
                props.updatePageTitle(result.slip_number);
                // setAlert(error.message, "error");

                if(loggedUser.Roles.lenght > 1 || loggedUser.Roles[0] != UserRoles.Sells) {

                    let found_finished_products = await MainAPI.getAll(cookies.login_token, "finished_product", 0, 0, {
                        production_id: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: result.production_id
                        },
                        store_id: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: result.store_id
                        },
                        slip_id: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: result.sys_id
                        },
                    }, "reference");
                    setFinishedProducts(found_finished_products.Items);

                }

            } else {
                props.updatePageTitle("New Receiving Slip");
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const loadSelectData = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            let temp_data = {
                products: [],
                stores: [],
                managerUsers: [],
            };

            temp_data.products = (await MainAPI.getAll(cookies.login_token, "product", 0, 0, {})).Items;
            temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;

            // temp_data.managerUsers = (await MainAPI.getAll(cookies.login_token, "user", 0, 0, {
            //     production_id: {
            //         type: FieldTypes.TEXT,
            //         operator: Operators.IS,
            //         value: UserRoles.ProductionManager
            //     }
            // })).Items;

            console.log("select data ", temp_data);

            setSelectData((prev: any) => ({...prev, ...temp_data}));

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const loadStoreProductions = async () => {
            
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {
            let store_products = (await MainAPI.getAll(cookies.login_token, "production", 0, 0, {
                store_id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: infoFields.store_id
                },
                status: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: "consumption_confirmed"
                },
            })).Items;
            setSelectData((prev: any) => ({ ...prev, inventoryItems: store_products}));
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const updateInput = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setFinishedProductInputs((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setFinishedProductInputs((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const updateInfoFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if([FieldTypes.DATETIME, FieldTypes.DATE].includes(type)) {
            setInfoFields((flds: any) =>({...flds, [field_name]: (new Date(value)).toISOString()}));
        } else if(type == FieldTypes.NUMBER) {
            setInfoFields((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setInfoFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const updateConsumptionFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setConsumptionInputs((flds: any) =>({...flds, [field_name]: parseInt(value)}));
        } else {
            setConsumptionInputs((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const formSubmit = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id && props.routeData.params.id == "-1") {

                let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "receive_product", {
                    ...infoFields,
                    Production: undefined,
                    Receiver: undefined,
                    Store: undefined,
                    updater: undefined,
                    creater: undefined
                });

                for(let prod of finishedProducts) {

                    children_result = await MainAPI.createNew(cookies.login_token, "finished_product", {
                        production_id: infoFields.production_id,
                        product_id: prod.producedItem.sys_id,
                        slip_id: parent_result.sys_id,
                        store_id: infoFields.store_id,
                        quantity: prod.quantity
                    });

                }

                props.mainNavigation({
                    id: `/receive-slip/${parent_result.sys_id}`,
                    title: "Loading...",
                    type: "page",
                    table: "",
                    rec_id: "",
                    dashboard_id: "receive-slip",
                    data: {
                        routeData: {
                            params: {
                                id: parent_result.sys_id
                            }
                        },
                        dataPassed: {}
                    }
                });

                setFinishedProducts([]);
                setInfoFields({
                    slip_number: "",
                    store_id: "",
                    received_by: "",
                    received_on: "",
                    status: "draft"
                })

            } else if(props.routeData.params.id) {
                let result = await MainAPI.update(cookies.login_token, "receive_product", {
                    ...infoFields,
                    // received_on: Utils.dateToISO(infoFields.received_on)
                    Production: undefined,
                    Receiver: undefined,
                    Store: undefined,
                    updater: undefined,
                    creater: undefined
                });
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const addProducts = async () => {

        if(!finishedProductInputs.product_id || finishedProductInputs.product_id == "") {
            setAlert("first please select the product id!", "error");
            return;
        } else if(!finishedProductInputs.quantity || finishedProductInputs.quantity == "") {
            setAlert("first please set Quantity first!", "error");
            return;
        }

        let found_product = selectData.products.find((prd: any) => (prd.sys_id == finishedProductInputs.product_id));
        if(found_product) {

            if(props.routeData.params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result = await MainAPI.createNew(cookies.login_token, "finished_product", {
                        production_id: infoFields.production_id,
                        product_id: found_product.sys_id,
                        slip_id: infoFields.sys_id,
                        store_id: infoFields.store_id,
                        quantity: parseFloat(finishedProductInputs.quantity)
                    });

                    setFinishedProducts((prod: any) => ([...prod, {
                        ...children_result,
                        producedItem: found_product,
                        quantity: parseFloat(finishedProductInputs.quantity)
                    }]));

                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {
                setFinishedProducts((prod: any) => ([...prod, {
                    sys_id: found_product.sys_id,
                    producedItem: found_product,
                    quantity: parseFloat(finishedProductInputs.quantity)
                }]));
            }

        }

        setFinishedProductInputs((fld: any) => ({
            product_id: "",
            quantity: ""
        }))

    }

    const addConsumption = async () => {

        let found_product = selectData.inventoryItems.find((prd: any) => (prd.sys_id == consumptionInputs.item_id));
        if(found_product) {

            if(props.routeData.params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result = await MainAPI.createNew(cookies.login_token, "production_consumption", {
                        production_id: infoFields.sys_id,
                        item_id: found_product.sys_id,
                        store_id: infoFields.store_id,
                        quantity: parseFloat(consumptionInputs.quantity)
                    });

                    setConsumptions((prod: any) => ([...prod, {
                        ...children_result,
                        consumedItem: found_product,
                        quantity: parseFloat(consumptionInputs.quantity)
                    }]));

                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {
                setConsumptions((prod: any) => ([...prod, {
                    consumedItem: found_product,
                    quantity: parseFloat(consumptionInputs.quantity)
                }]));
            }

        }

        setConsumptionInputs((fld: any) => ({
            item_id: "",
            quantity: ""
        }));

    }

    const deleteConsumption = async (id: string) => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id == "-1") {
                setConsumptions((prev: any) => (prev.filter(prv => (prv.consumedItem.sys_id != id))));
            } else {
                
                let result = await MainAPI.deleteList(cookies.login_token, "production_consumption", [id]);
                setConsumptions((prev: any) => (prev.filter(prv => (prv.sys_id != id))));
                setAlert(`${result.found.length} records were requested to be deleted and ${result.deleted.length} records has been deleted.`);

            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const deleteFinishedProduct = async (id: string) => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id == "-1") {
                setFinishedProducts((prev: any) => (prev.filter(prv => (prv.sys_id != id))));
            } else {
                let result = await MainAPI.deleteList(cookies.login_token, "finished_product", [id]);
                setFinishedProducts((prev: any) => (prev.filter(prv => (prv.sys_id != id))));
                setAlert(`${result.found.length} records were requested to be deleted and ${result.deleted.length} records has been deleted.`)
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="row m-0 h-100 py-3" >
            <div className="col-6 h-100" style={{overflow: "hidden auto"}}>

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3"> { (props.routeData.params.id && props.routeData.params.id != "-1") ? infoFields.slip_number : "New Receiving Slip" } </div>
                            <div className="btn-group">
                                <button className="btn btn-secondary btn-sm px-3" type="button">
                                    {getDisplaySelect("receive_product.status", infoFields.status).label ?? "Draft"}
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        (["draft"].includes(infoFields.status) && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.ProductionManager])) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "waiting_acceptance", FieldTypes.TEXT)}, 10)}}>Send For Store Acceptance</button>
                                            </li>
                                        )
                                    }
                                    {
                                        (["waiting_acceptance"].includes(infoFields.status) && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager])) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "receive_confirmed", FieldTypes.TEXT)}, 10)}}>Accept Products</button>
                                            </li>
                                        )
                                    }
                                    {
                                        ("waiting_acceptance" == infoFields.status && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager])) && (
                                            <li>
                                                <button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "receive_cancelled", FieldTypes.TEXT)}, 10)}}>Cancel Production</button>
                                            </li>
                                        )
                                    }
                                </ul>
                                <button className="btn btn-sm btn-dark" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <i 
                                        className="bx bx-refresh"
                                        style={{fontSize: '20px', transform: `translateY(10%)`}}
                                        onClick={async () => {
                                            await loadData();
                                            await loadSelectData();
                                        }}
                                    />
                                </button>
                            </div>
                            {/* <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div> */}
                        </div>
                        {/*
                            (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                <div className="d-flex justify-content-between mt-2">
                                    <div>{Utils.formatPrice((infoFields.total_consumed_price ?? 0), "ETB")} Consumed</div>
                                    <div>{Utils.formatPrice((infoFields.total_produced_price ?? 0), "ETB")} Produced</div>
                                </div>
                            )
                        */}
                        <div className="d-flex justify-content-between mt-2">
                            <div>Received By {infoFields.Receiver ? infoFields.Receiver.full_name : "Not Set"}</div>
                            <div>Received On {infoFields.received_on ? Utils.isoToReadableDateTime(infoFields.received_on, localData.dateConfig) : "Not Set"}</div>
                        </div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={infoFields.store_id} onChange={(event: any) => {updateInfoFields("store_id", event.target.value)}} disabled={(props.routeData.params.id && props.routeData.params.id != "-1")} >
                            <option value="">Branch/Store</option>
                            {
                                selectData.stores.map((str: any) => (
                                    <option value={str.sys_id} selected={(str.sys_id == infoFields.store_id)}>{str.name}</option>
                                ))
                            }
                        </select>
                        {
                            infoFields.store_id && (
                                <button className="btn btn-sm zbtn" onClick={async () => {
                                    props.mainNavigation({
                                        id: `/form/store/${infoFields.store_id}`,
                                        title: "Loading...",
                                        type: "form",
                                        table: "store",
                                        rec_id: infoFields.store_id,
                                        dashboard_id: "",
                                        data: {
                                            routeData: {
                                                params: {
                                                    id: infoFields.store_id
                                                }
                                            },
                                            dataPassed: {}
                                        }
                                    });
                                }}>
                                    <i className="bx bx-link-external" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                                </button>
                            )
                        }
                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                            props.mainNavigation({
                                id: `/form/store/-1`,
                                title: "Loading...",
                                type: "form",
                                table: "store",
                                rec_id: "-1",
                                dashboard_id: "",
                                data: {
                                    routeData: {
                                        params: {
                                            id: "-1"
                                        }
                                    },
                                    dataPassed: {}
                                }
                            });
                        }}>
                            <i className="bx bx-list-plus" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                        </button>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{fontSize: '20px'}} />
                        <select className="form-control form-control-sm zinput mx-1 py-1 border-0" value={infoFields.production_id} onChange={(event: any) => {updateInfoFields("production_id", event.target.value)}} disabled={(props.routeData.params.id && props.routeData.params.id != "-1")} >
                            <option value="">Select Production</option>
                            {
                                selectData.inventoryItems.map((prd: any) => (
                                    <option value={prd.sys_id}>{prd.prod_number}</option>
                                ))
                            }
                        </select>
                        {
                            infoFields.production_id && (
                                <button className="btn btn-sm zbtn" onClick={async () => {
                                    props.mainNavigation({
                                        id: `/form/production/${infoFields.production_id}`,
                                        title: "Loading...",
                                        type: "form",
                                        table: "production",
                                        rec_id: infoFields.production_id,
                                        dashboard_id: "",
                                        data: {
                                            routeData: {
                                                params: {
                                                    id: infoFields.production_id
                                                }
                                            },
                                            dataPassed: {}
                                        }
                                    });
                                }}>
                                    <i className="bx bx-link-external" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                                </button>
                            )
                        }
                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                            props.mainNavigation({
                                id: `/form/production/-1`,
                                title: "Loading...",
                                type: "form",
                                table: "production",
                                rec_id: "-1",
                                dashboard_id: "",
                                data: {
                                    routeData: {
                                        params: {
                                            id: "-1"
                                        }
                                    },
                                    dataPassed: {}
                                }
                            });
                        }}>
                            <i className="bx bx-list-plus" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                        </button>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    {/* <div className="search-bar d-flex justify-content-between align-items-center">
                        <MoneyOffIcon style={{fontSize: '20px'}} />
                    </div> */}
                    <div className="mb-2">Cancellation Reason</div>
                    <textarea
                        className="form-control zinput border-0 py-1"
                        value={infoFields.cancel_reason}
                        onChange={(event: any) => {updateInfoFields("cancel_reason", event.target.value)}}
                        placeholder="Cancellation Reason"
                    />
                </div>

                {
                    (!(loggedUser.Roles.includes(UserRoles.Sells))) && (
                        <ol className="list-group list-group shadow-sm">
                            <li className="list-group-item d-flex justify-content-between border-0 border-bottom zbtn">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <div className="fw-bold fs-3">Finished Products In</div>
                                    {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) ? (
                                            <div className="fw-bold fs-6">{ Utils.formatPrice(finishedProducts.reduce((acc: number, crr: any) => (acc + (crr.producedItem.unit_price * crr.quantity)), 0), "ETB")}</div>
                                        ) : (<div></div>)
                                    }
                                </div>
                            </li>

                            {
                                (finishedProducts.length == 0) && (
                                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zpanel">
                                        <h3 className="text-center">No Finished Product Added yet</h3>
                                    </li>
                                )
                            }

                            {
                                finishedProducts.map((prod: any) => (
                                    <li className="list-group-item p-0 m-0 d-flex border-0 border-bottom zpanel">
                                        <div className="px-3 py-2 w-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="fw-bold">{Utils.roleCheck(loggedUser.Roles, [UserRoles.ProductionManager, UserRoles.BranchManager]) ? prod.producedItem.product_number : prod.producedItem.name}</div>
                                                {
                                                    (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                                        <span className="badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{Utils.formatPrice((prod.quantity*prod.producedItem.unit_price), "ETB")}</span>
                                                    )
                                                }
                                            </div>
                                            {prod.quantity}{prod.producedItem.measuring_unit}
                                        </div>
                                        {
                                            (infoFields.status == "draft") && (
                                                <div className="col">
                                                    <button 
                                                        className="btn btn-outline-danger px-2 py-2 rounded-0 h-100"
                                                        title="Delete this Produced Item?"
                                                        onClick={() => {deleteFinishedProduct(prod.sys_id)}}
                                                    >
                                                        <i className='bx bx-trash'></i>
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </li>
                                ))
                            }

                            {
                                (infoFields.status == "draft" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.ProductionManager])) && (
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-2 pt-4 zpanel">
                                        <button className="btn btn-sm zbtn me-2" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/product/-1`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "product",
                                                rec_id: "-1",
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: "-1"
                                                        }
                                                    },
                                                    dataPassed: {}
                                                }
                                            });
                                        }}>
                                            <i className="bx bx-list-plus" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                                        </button>
                                        <select className="form-control form-control-sm zinput me-1 py-1" value={finishedProductInputs.product_id} onChange={(event: any) => {updateInput("product_id", event.target.value)}} >
                                            <option value="">Select Product</option>
                                            {
                                                selectData.products.map((prd: any) => (
                                                    <option value={prd.sys_id}>{Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) ? prd.name : prd.product_number}</option>
                                                ))
                                            }
                                        </select>
                                        <input type="text" className="form-control form-control-sm zinput mx-1 py-1" value={finishedProductInputs.quantity} onChange={(event: any) => {updateInput("quantity", event.target.value, FieldTypes.FLOAT)}} placeholder="Quantity" />
                                        <button className="btn btn-sm zbtn ">
                                            <i className="bx bx-add-to-queue" style={{fontSize: '20px', transform: `translateY(10%)`}} onClick={async () => {await addProducts()}} />
                                        </button>
                                    </li>
                                )
                            }
                        </ol>
                    )
                }
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn zbtn my-2" onClick={formSubmit}>
                        {((props.routeData.params.id && props.routeData.params.id != "-1") ? "Update" : "Submit")}
                    </button>
                </div>

            </div>
            <div className="col mx-1 zpanel rounded-top-3 shadow-sm h-100" style={{overflow: "hidden auto"}}>
                {
                    (props.routeData.params.id && props.routeData.params.id != "-1") && (
                        <RecordActivity tableName="receive_product" recordId={props.routeData.params.id} />
                    )
                }
            </div>
            <div className="col mx-1 zpanel p-0 rounded-top-3 shadow-sm" style={{overflow: "hidden auto"}}>
                {
                    (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.BranchManager])) ? (
                        <FormAttachment tableName="receive_product" recordId={props.routeData.params.id} canAddAttachment={props.routeData.params.id == "-1" ? [] : [UserRoles.Admin]} />
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">No Permission For Attachments</h4>
                            </div>
                        </div>
                    )
                }
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

export default ReceivingSlip;