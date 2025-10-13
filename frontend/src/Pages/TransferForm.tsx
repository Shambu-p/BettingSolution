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
import { isMobile } from "react-device-detect";


const TransferForm = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
    const [transactionInputs, setTransactionInputs] = useState<any>({
        category: TransactionCategory.sell,
        type: TransactionType.Debit,
        status: true,
        amount: 0,
        sell_id: "",
    });
    const [selectData, setSelectData] = useState<any>({
        products: [],
        stores: [],
        users: [],
        deliveries: []
    });
    const [localWaiting, setLocalWaiting] = useState(false);
    const [inputFields, setInputFields] = useState<any>({
        product_id: "",
        quantity: ""
    });
    const [infoFields, setInfoFields] = useState<any>({
        transfer_number: "",
        store_from_id: "",
        store_to_id: "",
        accepted_by: "",
        approved_by: "",
        delivery_id: "",
        type: "",
        sent_to: "",
        cancel_reason: "",
        started_on: "",
        finished_on: "",
        status: "draft"
    });

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [infoFields.store_from_id]);

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
                let result = await MainAPI.getSingle(cookies.login_token, "transfer", props.routeData.params.id);
                let found_products = await MainAPI.getAll(cookies.login_token, "transfer_product", 0, 0, {
                    transfer_id: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: result.sys_id
                    },
                }, "reference");
                setProducts(found_products.Items);
                setInfoFields(result);
                props.updatePageTitle(result.transfer_number);
                // setAlert(error.message, "error");

            } else {
                props.updatePageTitle("New Sell Order Form");
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
                users: [],
                deliveries: []
            };
    
            temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;
            temp_data.deliveries = (await MainAPI.getAll(cookies.login_token, "delivery", 0, 0, {})).Items;
            temp_data.users = (await MainAPI.getAll(cookies.login_token, "user", 0, 0, {})).Items;

            setSelectData(temp_data);
            // if(params.id && params.id != "-1") {
                // setAlert(error.message, "error");
            // }
    
        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
        
    }
    
    const loadProducts = async () => {
        
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {
            let store_products = (await MainAPI.getAll(cookies.login_token, "store_product", 0, 0, {
                store_id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: infoFields.store_from_id
                },
            }, "reference")).Items;
            setSelectData((prev: any) => ({ ...prev, products: store_products.map((prd: any) => ({...prd.ItemProduct, quantity: prd.quantity}))}));
        } catch(error: any) {
            
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const updateInput = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setInputFields((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setInputFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const updateInfoFields = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setInfoFields((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setInfoFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const updateTransactionInputs = (field_name: string, value: any, type: FieldTypes = FieldTypes.TEXT) => {
        if(type == FieldTypes.NUMBER) {
            setTransactionInputs((flds: any) =>({...flds, [field_name]: parseInt(value) ?? 0}));
        } else {
            setTransactionInputs((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const formSubmit = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(!props.routeData.params.id || props.routeData.params.id == "-1") {

                // let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "transfer", {
                    ...infoFields
                });

                for(let prod of products) {

                    await MainAPI.createNew(cookies.login_token, "transfer_product", {
                        transfer_id: parent_result.sys_id,
                        product_id: prod.productItem.sys_id,
                        quantity: prod.quantity
                    });

                }

                props.mainNavigation({
                    id: `/transfer-form/${parent_result.sys_id}`,
                    title: "Loading...",
                    type: "page",
                    table: "",
                    rec_id: "",
                    dashboard_id: "transfer-form",
                    data: {
                        routeData: {
                            params: {
                                id: parent_result.sys_id
                            }
                        },
                        dataPassed: {}
                    }
                });

            } else if(props.routeData.params.id) {
                let result = await MainAPI.update(cookies.login_token, "transfer", {
                    ...infoFields
                });
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const addProducts = async () => {

        let found_product = selectData.products.find((prd: any) => (prd.sys_id == inputFields.product_id));
        let found_selected_product = products.find((prd: any) => (prd.productItem.sys_id == inputFields.product_id));

        if(found_product) {

            if(props.routeData.params.id && props.routeData.params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result;
                    if(found_selected_product) {

                        children_result = await MainAPI.update(cookies.login_token, "transfer_product", {
                            ...found_selected_product,
                            quantity: (parseFloat(inputFields.quantity) + found_selected_product.quantity)
                        });

                        setProducts((prev: any[]) => (
                            prev.map((prod: any) => ((prod.productItem.sys_id == inputFields.product_id) ? 
                                ({
                                    ...prod,
                                    quantity: (parseFloat(inputFields.quantity) + prod.quantity)
                                }) : prod
                            ))
                        ));

                    } else {

                        children_result = await MainAPI.createNew(cookies.login_token, "transfer_product", {
                            transfer_id: infoFields.sys_id,
                            product_id: found_product.sys_id,
                            quantity: parseFloat(inputFields.quantity)
                        });

                        setProducts((prod: any) => ([...prod, {
                            productItem: found_product,
                            quantity: children_result.quantity
                        }]));

                    }


                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {

                if(found_selected_product) {
                    setProducts((prev: any[]) => (
                        prev.map((prod: any) => ((prod.productItem.sys_id == inputFields.product_id) ? 
                            ({
                                ...prod,
                                quantity: (parseFloat(inputFields.quantity) + prod.quantity)
                            }) : prod
                        ))
                    ));
                } else {
                    setProducts((prod: any) => ([...prod, {
                        productItem: found_product,
                        quantity: parseFloat(inputFields.quantity)
                    }]));
                }
            }

        }

        setInputFields((fld: any) => ({
            product_id: "",
            quantity: ""
        }))

    }

    // const addTransaction = async () => {

    //     setTimeout(() => {setLocalWaiting(true);}, 10);

    //     try {

    //         let transaction_result = await MainAPI.createNew(cookies.login_token, "transaction", {
    //             ...transactionInputs,
    //             amount: parseFloat(transactionInputs.amount),
    //             trx_number: undefined,
    //             sell_id: infoFields.sys_id
    //         });

    //         setTransactionHistory((prod: any) => ([...prod, {...transaction_result}]));

    //     } catch(error) {
    //         setAlert(error.message, "error");
    //     }

    //     setTimeout(() => {setLocalWaiting(false);}, 10);

    //     setTransactionInputs((fld: any) => ({
    //         ...fld,
    //         amount: 0
    //     }));

    // }

    const deleteProducts = async (id: string) => {
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id == "-1") {
                setProducts((prev: any) => (prev.filter(prv => (prv.productItem.sys_id != id))));
            } else {

                let result = await MainAPI.deleteList(cookies.login_token, "transfer_product", [id]);
                setAlert(`${result.found.length} records were requested to be deleted and ${result.deleted.length} records has been deleted.`);

            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    }

    return (
        <div className="row m-0 h-100 mt-3" >
            <div className="col-sm-12 col-md-6 h-100" style={{overflow: "hidden auto"}}>

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3">{ (props.routeData.params.id && props.routeData.params.id != "-1") ? infoFields.transfer_number : "New Sell Order" }</div>
                            <div className="btn-group">
                                <button className="btn btn-secondary btn-sm px-3" type="button">
                                    {getDisplaySelect("transfer.status", infoFields.status).label ?? "Draft"}
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        ((Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) || (Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Sells]) && loggedUser.Stores.includes(infoFields.store_from_id))) && ["waiting_store_approval", "draft"].includes(infoFields.status)) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "cancelled", FieldTypes.TEXT)}, 10)}}>Cancel Order</button></li>
                                        )
                                    }
                                    {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && infoFields.status == "draft" && infoFields.type == "order") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "waiting_store_approval", FieldTypes.TEXT)}, 10)}}>Send To Store</button></li>
                                        )
                                    }
                                    {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) && infoFields.status == "draft" && infoFields.type == "return") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "store_approved", FieldTypes.TEXT)}, 10)}}>Send To Store</button></li>
                                        )
                                    }
                                    {/* {
                                        ((Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) || (Utils.roleCheck(loggedUser.Roles, [UserRoles.Sells]) && loggedUser.Stores.includes(infoFields.store_from_id)))  && ["store_approved", "on_the_way"].includes(infoFields.status)) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "waiting_to_be_received", FieldTypes.TEXT)}, 10)}}>Delivered</button></li>
                                        )
                                    } */}
                                    {/* {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.BranchManager, UserRoles.Sells]) && loggedUser.Stores.includes(infoFields.store_from_id) && infoFields.status == "store_approved") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "on_the_way", FieldTypes.TEXT)}, 10)}}>On The Way</button></li>
                                        )
                                    } */}
                                    {
                                        ((Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) || (Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance]) && loggedUser.Stores.includes(infoFields.store_to_id))) && infoFields.status == "store_approved") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "received", FieldTypes.TEXT)}, 10)}}>Receive</button></li>
                                        )
                                    }
                                    {
                                        ((Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) || (Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Sells, UserRoles.Finance]) && loggedUser.Stores.includes(infoFields.store_from_id))) && infoFields.status == "waiting_store_approval") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "store_approved", FieldTypes.TEXT)}, 10)}}>Approve Order</button></li>
                                        )
                                    }
                                </ul>
                                <button className="btn btn-sm btn-dark" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <i 
                                        className="bx bx-refresh"
                                        style={{fontSize: '20px', transform: `translateY(10%)`}}
                                        onClick={async () => {
                                            await loadData()
                                        }}
                                    />
                                </button>
                            </div>
                            {/* <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div> */}
                        </div>

                        <div className="d-flex justify-content-between mt-2">
                            <div>{infoFields.started_on ? Utils.isoToReadableDateTime(infoFields.started_on, localData.dateConfig) : "Not Set"} Departed</div>
                            <div>{infoFields.finished_on ? Utils.isoToReadableDateTime(infoFields.finished_on, localData.dateConfig) : "Not Set"} Arrived</div>
                        </div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">From Store/Sells</div>
                            <div className="d-flex justify-content-between">

                                <select className="form-control zinput border-0 py-1" disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) || (infoFields.created_by && infoFields.created_by != loggedUser.sys_id))} value={infoFields.store_id} onChange={(event: any) => {updateInfoFields("store_from_id", event.target.value)}} >
                                    <option value="">From Store/Sells</option>
                                    {
                                        selectData.stores.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.store_from_id)}>{str.name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    infoFields.store_id && (
                                        <button className="btn btn-sm zbtn" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/store/${infoFields.store_from_id}`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "store",
                                                rec_id: infoFields.store_from_id,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.store_from_id
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
                                {
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">To Store/Sells</div>
                            <div className="d-flex justify-content-between">

                                <select className="form-control zinput border-0 py-1" disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) || (infoFields.created_by && infoFields.created_by != loggedUser.sys_id))} value={infoFields.store_to_id} onChange={(event: any) => {updateInfoFields("store_to_id", event.target.value)}} >
                                    <option value="">To Store/Sells</option>
                                    {
                                        selectData.stores.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.store_to_id)}>{str.name}</option>
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
                                                rec_id: infoFields.store_to_id,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.store_to_id
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
                                {
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bx-user-pin" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">Accepted By</div>
                            <div className="d-flex justify-content-between">

                                <select className="form-control zinput border-0 py-1" disabled={true} value={infoFields.accepted_by} onChange={(event: any) => {updateInfoFields("accepted_by", event.target.value)}} >
                                    <option value="">Accepted By</option>
                                    {
                                        selectData.users.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.accepted_by)}>{str.full_name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    infoFields.customer_id && (
                                        <button className="btn btn-sm zbtn" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/user/${infoFields.accepted_by}`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "user",
                                                rec_id: infoFields.accepted_by,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.accepted_by
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
                                {
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
                                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/user/-1`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "user",
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bx-user-pin" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">Approved By</div>
                            <div className="d-flex justify-content-between">

                                <select className="form-control zinput border-0 py-1" disabled={true} value={infoFields.approved_by} onChange={(event: any) => {updateInfoFields("approved_by", event.target.value)}} >
                                    <option value="">Approved By</option>
                                    {
                                        selectData.users.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.approved_by)}>{str.full_name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    infoFields.approved_id && (
                                        <button className="btn btn-sm zbtn" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/user/${infoFields.approved_by}`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "user",
                                                rec_id: infoFields.approved_by,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.approved_by
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
                                {
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
                                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/user/-1`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "user",
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bxs-truck" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">Delivery</div>
                            <div className="d-flex justify-content-between">

                                <select className="form-control zinput border-0 py-1" disabled={(infoFields.created_by && (infoFields.created_by != loggedUser.sys_id))} value={infoFields.delivery_id} onChange={(event: any) => {updateInfoFields("delivery_id", event.target.value)}} >
                                    <option value="">Delivery</option>
                                    {
                                        selectData.deliveries.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.delivery_id)}>{str.name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    infoFields.delivery_id && (
                                        <button className="btn btn-sm zbtn" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/delivery/${infoFields.delivery_id}`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "delivery",
                                                rec_id: infoFields.delivery_id,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.delivery_id
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
                                {
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin]) && (
                                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/delivery/-1`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "delivery",
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <i className="bx bx-purchase-tag" style={{fontSize: '20px'}}></i>
                        <div className="w-100 ms-2">
                            <div className="label mb-1">Type</div>
                            <select className="form-control zinput border-0 py-1" disabled={(infoFields.sys_id)} value={infoFields.type} onChange={(event: any) => {updateInfoFields("type", event.target.value)}} >
                                <option value="">Type</option>
                                {
                                    localData.Choices.filter((ch: any) => (ch.id == "transfer.type")).map((str: any) => (
                                        <option value={str.value} selected={(str.value == infoFields.type)}>{str.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        {/* <MoneyOffIcon style={{fontSize: '20px'}} /> */}
                        <div className="w-100">
                            <div className="label mb-1">Send To</div>
                            <input type="text" className="form-control zinput border-0 py-1" disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) || (infoFields.created_by && infoFields.created_by != loggedUser.sys_id))} value={infoFields.sent_to} onChange={(event: any) => {updateInfoFields("sent_to", event.target.value, FieldTypes.TEXT)}} placeholder="Send To" />
                        </div>
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

                <ol className="list-group list-group shadow-sm">
                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <div className="fw-bold fs-3">Ordered Items</div>
                            {
                                Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance]) && (
                                    <div className="fw-bold fs-6">{Utils.formatPrice(products.reduce((acc: number, crr: any) => (acc + (crr.productItem.unit_price * crr.quantity)), 0), "ETB")}</div>
                                )
                            }
                        </div>
                    </li>

                    {
                        (products.length == 0) && (
                            <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zpanel">
                                <h3 className="text-center">
                                    No Products Are Selected yet
                                </h3>
                            </li>
                        )
                    }

                    {
                        products.map((prod: any) => (
                            <li className="list-group-item p-0 d-flex border-0 border-bottom zpanel w-100">
                                <div className="px-3 py-2 w-100">
                                    <div className="fw-bold">
                                        {prod.productItem.name}
                                    </div>
                                    {prod.quantity} {getDisplaySelect("product.measuring_unit", prod.productItem.measuring_unit).label ?? ""}
                                </div>
                                {
                                    (infoFields.status == "draft") && (
                                        <div className="col">
                                            <button 
                                                className="btn btn-outline-danger px-2 py-2 rounded-0 h-100"
                                                title="Delete this Consumption Item?"
                                                onClick={() => {deleteProducts(props.routeData.params.id == "-1" ? prod.productItem.sys_id : prod.sys_id)}}
                                            >
                                                <i className='bx bx-trash' />
                                            </button>
                                        </div>
                                    )
                                }
                            </li>
                        ))
                    }

                    {
                        (infoFields.status == "draft") && (
                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-2 pt-4 zpanel">
                                <select className="form-control form-control-sm zinput me-1 py-1" value={inputFields.product_id} onChange={(event: any) => {updateInput("product_id", event.target.value)}} >
                                    <option value="">Select Product</option>
                                    {
                                        selectData.products.map((prd: any) => (
                                            <option value={prd.sys_id}>{`${prd.name} - ${prd.quantity}`}</option>
                                        ))
                                    }
                                </select>
                                <input className="form-control form-control-sm zinput mx-1 py-1" value={inputFields.quantity} onChange={(event: any) => {updateInput("quantity", event.target.value, FieldTypes.FLOAT)}} placeholder="Quantity" />
                                <button className="btn btn-sm zbtn" onClick={async () => {await addProducts()}}>
                                    <i className="bx bx-add-to-queue" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                                </button>
                            </li>
                        )
                    }
                </ol>

                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn zbtn my-2" onClick={formSubmit}>
                        {((props.routeData.params.id && props.routeData.params.id != "-1") ? "Update" : "Create")}
                    </button>
                </div>

            </div>
            {
                !isMobile && (
                    <div className="col mx-1 zpanel rounded-top-3 shadow-sm h-100" style={{overflow: "hidden auto"}}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1") && (
                                <RecordActivity tableName="transfer" recordId={props.routeData.params.id} />
                            )
                        }
                    </div>
                )
            }
            {
                !isMobile && (
                    <div className="col mx-1 zpanel p-0 rounded-top-3 shadow-sm h-100" style={{overflow: "hidden auto"}}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells])) ? (
                                <FormAttachment tableName="transfer" recordId={props.routeData.params.id} canAddAttachment={props.routeData.params.id == "-1" ? [] : [UserRoles.Admin, UserRoles.Finance]} />
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

export default TransferForm;