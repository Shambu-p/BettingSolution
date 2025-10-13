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
import Operators from "../Enums/Operators";
import RecordActivity from "../Components/Reusables/RecordActivity";
import TransactionType from "../Enums/TransactionType";
import TransactionCategory from "../Enums/TransactionCategory";


const CreatePurchase = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    // const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
    const [transactionInputs, setTransactionInputs] = useState<any>({
        category: TransactionCategory.purchase,
        type: TransactionType.Debit,
        status: true,
        amount: 0,
        purchase_id: "",
    });
    const [selectData, setSelectData] = useState<any>({
        products: [],
        stores: [],
        customers: [],
        deliveries: []
    });
    const [localWaiting, setLocalWaiting] = useState(false);
    const [inputFields, setInputFields] = useState<any>({
        product_id: "",
        quantity: "",
        unit_price: "",
        tax_percentage: ""
    });
    const [infoFields, setInfoFields] = useState<any>({
        store_id: "",
        customer_id: "",
        paid_price: 0,
        remaining_price: 0,
        status: "draft",
        tax_amount: 0
    });

    useEffect(() => {
        loadData();
        loadSelectData();
    }, [props.routeData.params.id]);

    // useEffect(() => {
    //     loadProducts();
    // }, [infoFields.store_id]);

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
                let result = await MainAPI.getSingle(cookies.login_token, "purchase", props.routeData.params.id);
                let found_products = await MainAPI.getAll(cookies.login_token, "purchase_item", 0, 0, {
                    purchase_id: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: result.sys_id
                    }
                }, "reference");

                if(Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) && result.status == "confirmed") {

                    let found_transactions = await MainAPI.getAll(cookies.login_token, "transaction", 0, 0, {
                        purchase_id: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: result.sys_id
                        },
                        type: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: TransactionType.Debit
                        },
                        category: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: TransactionCategory.purchase
                        },
                    }, "reference");
                    setTransactionHistory(found_transactions.Items);

                }
                setProducts(found_products.Items);
                setTransactionInputs(prev => ({...prev, purchase_id: result.sys_id}));
                console.log("loaded data ", result);
                setInfoFields(result);
                // setAlert(error.message, "error");
                props.updatePageTitle(result.purchase_number);
            } else {
                props.updatePageTitle("New Purchase");
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
                customers: [],
                deliveries: []
            };

            temp_data.products = (await MainAPI.getAll(cookies.login_token, "inventory_item", 0, 0, {
                is_defination: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: true
                }
            })).Items;
            temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;
            // temp_data.deliveries = (await MainAPI.getAll(cookies.login_token, "delivery", 0, 0, {})).Items;
            temp_data.customers = (await MainAPI.getAll(cookies.login_token, "customer", 0, 0, {
                type: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: 'vendor'
                },
            })).Items;

            setSelectData(temp_data);
            // if(params.id && params.id != "-1") {
                // setAlert(error.message, "error");
            // }

        } catch(error: any) {
            setAlert(error.message, "error");
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

            if(props.routeData.params.id && props.routeData.params.id == "-1") {

                let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "purchase", {
                    purchase_number: undefined,
                    ...infoFields
                });

                for(let prod of products) {

                    children_result = await MainAPI.createNew(cookies.login_token, "purchase_item", {
                        purchase_id: parent_result.sys_id,
                        item_id: prod.purchaseItem.sys_id,
                        store_id: infoFields.store_id,
                        quantity: prod.quantity,
                        unit_price: prod.unit_price,
                        tax_percentage: prod.tax_percentage
                    });

                }

                props.mainNavigation({
                    id: `/create-purchase/${parent_result.sys_id}`,
                    title: "Loading...",
                    type: "page",
                    table: "",
                    rec_id: "",
                    dashboard_id: "create-purchase",
                    data: {
                        routeData: {
                            params: {
                                id: parent_result.sys_id
                            }
                        },
                        dataPassed: {}
                    }
                });

                setInfoFields({
                    store_id: "",
                    customer_id: "",
                    paid_price: 0,
                    remaining_price: 0,
                    status: "draft",
                    tax_amount: 0
                });

                setProducts([]);

            } else if(props.routeData.params.id) {
                let result = await MainAPI.update(cookies.login_token, "purchase", {
                    ...infoFields,
                    paid_amount: (infoFields.paid_amount ?? undefined),
                    remained_amount: (infoFields.remained_amount ?? undefined),
                    tax_amount: (infoFields.tax_amount ?? undefined)
                });
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const addProducts = async () => {

        if(!inputFields.product_id || !inputFields.quantity || !inputFields.unit_price) {
            setAlert(`Fill all necessary fields before submitting!`, "error");
            console.log(inputFields);
            return;
        }

        if(!inputFields.tax_percentage) {
            inputFields.tax_percentage = 0;
        }

        let found_product = selectData.products.find((prd: any) => (prd.sys_id == inputFields.product_id));
        if(found_product) {

            inputFields.before_tax = (inputFields.quantity * inputFields.unit_price);
            inputFields.tax_amount = (inputFields.before_tax * parseFloat(inputFields.tax_percentage));
            inputFields.total_price = (inputFields.before_tax + inputFields.tax_amount);

            if(props.routeData.params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result = await MainAPI.createNew(cookies.login_token, "purchase_item", {
                        purchase_id: infoFields.sys_id,
                        item_id: found_product.sys_id,
                        store_id: infoFields.store_id,
                        quantity: parseFloat(inputFields.quantity),
                        unit_price: parseFloat(inputFields.unit_price),
                        tax_percentage: inputFields.tax_percentage,
                        total_price: inputFields.total_price,
                        tax_amount: inputFields.tax_amount
                    });

                    setProducts((prod: any) => ([...prod, {
                        purchaseItem: found_product,
                        quantity: parseFloat(inputFields.quantity),
                        unit_price: parseFloat(inputFields.unit_price),
                        tax_percentage: parseFloat(inputFields.tax_percentage),
                        before_tax: inputFields.before_tax,
                        tax_amount: inputFields.tax_amount,
                        total_price: inputFields.total_price
                    }]));

                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {
                setProducts((prod: any) => ([...prod, {
                    purchaseItem: found_product,
                    quantity: parseFloat(inputFields.quantity),
                    unit_price: parseFloat(inputFields.unit_price),
                    tax_percentage: parseFloat(inputFields.tax_percentage),
                    before_tax: inputFields.before_tax,
                    tax_amount: inputFields.tax_amount,
                    total_price: inputFields.total_price
                }]));
            }

        }

        setInputFields((fld: any) => ({
            product_id: "",
            quantity: "",
            unit_price: "",
            tax_percentage: ""
        }))

    }
    const addTransaction = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);

        try {

            let transaction_result = await MainAPI.createNew(cookies.login_token, "transaction", {
                ...transactionInputs,
                amount: parseFloat(transactionInputs.amount),
                trx_number: undefined,
                purchase_id: infoFields.sys_id
            });

            setTransactionHistory((prod: any) => ([...prod, {...transaction_result}]));

        } catch(error) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

        setTransactionInputs((fld: any) => ({
            ...fld,
            amount: 0
        }));

    }

    const deleteRowMaterial = async (id: string) => {
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id == "-1") {
                setProducts((prev: any) => (prev.filter(prv => (prv.purchaseItem.sys_id != id))));
            } else {

                let result = await MainAPI.deleteList(cookies.login_token, "purchase_item", [id]);
                setAlert(`${result.found.length} records were requested to be deleted and ${result.deleted.length} records has been deleted.`);

            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    }

    return (
        <div className="row m-0 h-100 mt-3" >
            <div className="col-6">

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3">{ (props.routeData.params.id && props.routeData.params.id != "-1") ? infoFields.purchase_number : "New Purchase" }</div>
                            <div className="btn-group">
                                <button className="btn btn-secondary btn-sm px-3" type="button">
                                    {getDisplaySelect("purchase.status", infoFields.status).label ?? "Draft"}
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {/*
                                        localData.Choices.filter((ch: any) => (ch.id == "purchase.status")).map((ch: any) => (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", ch.value, FieldTypes.TEXT)}, 10)}}>{ch.label}</button></li>
                                        ))
                                    */}
                                    {
                                        (infoFields.status == "waiting_approval" && Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Finance, UserRoles.Admin])) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "confirmed", FieldTypes.TEXT)}, 10)}}>Items Received</button></li>
                                        )
                                    }
                                    {
                                        (infoFields.status == "draft" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "waiting_approval", FieldTypes.TEXT)}, 10)}}>Send For Approval</button></li>
                                        )
                                    }
                                    {
                                        (infoFields.status == "waiting_approval" && Utils.roleCheck(loggedUser.Roles, [UserRoles.BranchManager, UserRoles.Admin])) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "cancelled", FieldTypes.TEXT)}, 10)}}>Cancel Purchase</button></li>
                                        )
                                    }

                                </ul>
                                <button className="btn btn-sm btn-dark" disabled={(!props.routeData.params.id || props.routeData.params.id == "-1")}>
                                    <i className="bx bx-refresh" style={{fontSize: '20px', transform: `translateY(10%)`}} onClick={async () => {
                                        await loadData()
                                    }} />
                                </button>
                            </div>

                            {/* <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div> */}
                        </div>
                        {(props.routeData.params.id && props.routeData.params.id != "-1") ? Utils.isoToDateTimeLocal(infoFields.created_on) : (new Date()).toISOString()}
                        {
                            (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                <div className="d-flex justify-content-between mt-2">
                                    <div>{Utils.formatPrice((infoFields.paid_amount ?? 0), "ETB")} Paid</div>
                                    <div>{Utils.formatPrice((infoFields.remained_amount ?? 0), "ETB")} Remaining</div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={inputFields.store_id} onChange={(event: any) => {updateInfoFields("store_id", event.target.value)}} >
                            <option value="">To Store</option>
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
                {
                    (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                        <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                            <div className="search-bar d-flex justify-content-between align-items-center">
                                <i className="bx bx-user-pin" style={{fontSize: '20px'}}></i>
                                <select className="form-control zinput mx-2 border-0 py-1" value={inputFields.customer_id} onChange={(event: any) => {updateInfoFields("customer_id", event.target.value)}} >
                                    <option value="">Seller</option>
                                    {
                                        selectData.customers.map((str: any) => (
                                            <option value={str.sys_id} selected={(str.sys_id == infoFields.customer_id)}>{str.name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    (infoFields.customer_id && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                        <button className="btn btn-sm zbtn" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/customer/${infoFields.customer_id}`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "customer",
                                                rec_id: infoFields.customer_id,
                                                dashboard_id: "",
                                                data: {
                                                    routeData: {
                                                        params: {
                                                            id: infoFields.customer_id
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
                                    Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && (
                                        <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                                            props.mainNavigation({
                                                id: `/form/customer/-1`,
                                                title: "Loading...",
                                                type: "form",
                                                table: "customer",
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
                    )
                }

                <ol className="list-group list-group shadow-sm">
                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <div className="fw-bold fs-3">Row Materials In</div>
                            {
                                (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) ? (
                                    <div className="fw-bold fs-6">{Utils.formatPrice(products.reduce((acc: number, crr: any) => (acc + crr.total_price), 0), "ETB")}</div>
                                ) : (<div ></div>)
                            }
                        </div>
                    </li>

                    {/*
                        products.map((prod: any) => (
                            <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zpanel">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{prod.purchaseItem.name}</div>
                                    {prod.quantity}{prod.purchaseItem.measuring_unit}
                                </div>
                                <span className="badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{Utils.formatPrice(prod.quantity*prod.unit_price, "ETB")}</span>
                            </li>
                        ))
                    */}

                    {
                        products.map((prod: any) => (
                            <li className="list-group-item p-0 d-flex border-0 border-bottom zpanel w-100">
                                <div className="px-3 py-2 w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="fw-bold">
                                            {prod.purchaseItem.name}
                                        </div>
                                        {
                                            (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) && (
                                                <span className="ms-auto badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{Utils.formatPrice(prod.total_price, "ETB")}</span>
                                            )
                                        }
                                    </div>
                                    {prod.quantity}{prod.purchaseItem.measuring_unit} --- {(!prod.tax_percentage || prod.tax_percentage == 0) ? "No Tax Deducted" : `Tax Deduction: ${prod.tax_percentage * 100}%`}
                                </div>
                                {
                                    (infoFields.status == "draft") && (
                                        <div className="col">
                                            <button 
                                                className="btn btn-outline-danger px-2 py-2 rounded-0 h-100"
                                                title="Delete this Consumption Item?"
                                                onClick={() => {deleteRowMaterial(props.routeData.params.id == "-1" ? prod.purchaseItem.sys_id : prod.sys_id)}}
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
                        (props.routeData.params.id == "-1" || infoFields.status == "draft") && (
                            <li className="list-group-item d-flex justify-content-between align-items-end border-0 px-2 pt-4 zpanel">
                                <div className="d-flex col-5 align-items-end me-1">
                                    <button className="btn btn-sm zbtn me-2" onClick={async () => {
                                        props.mainNavigation({
                                            id: `/form/inventory_item/-1`,
                                            title: "Loading...",
                                            type: "form",
                                            table: "inventory_item",
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
                                    <div className="w-100">
                                        <label htmlFor="">Raw Material</label>
                                        <select className="form-control form-control-sm zinput py-1" value={inputFields.product_id} onChange={(event: any) => {updateInput("product_id", event.target.value)}} >
                                            <option value="">Select Raw Material</option>
                                            {
                                                selectData.products.map((prd: any) => (
                                                    <option value={prd.sys_id}>{prd.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="w-100 mx-1">
                                    <label htmlFor="">Quantity</label>
                                    <input
                                        className="form-control form-control-sm zinput py-1"
                                        value={inputFields.quantity}
                                        onChange={(event: any) => {updateInput("quantity", event.target.value, FieldTypes.FLOAT)}}
                                        placeholder="Quantity"
                                    />
                                </div>
                                <div className="w-100 mx-1">
                                    <label htmlFor="">Unit Price</label>
                                    <input
                                        className="form-control form-control-sm zinput py-1"
                                        value={inputFields.unit_price}
                                        onChange={(event: any) => {updateInput("unit_price", event.target.value, FieldTypes.FLOAT)}}
                                        placeholder="Unit Price"
                                    />
                                </div>
                                <div className="w-100 mx-1">
                                    <label htmlFor="">Tax %</label>
                                    <select
                                        className="form-control form-control-sm zinput py-1"
                                        value={inputFields.tax_percentage}
                                        onChange={(event: any) => {updateInput("tax_percentage", event.target.value, FieldTypes.FLOAT)}}
                                    >
                                        <option value="0">Tax</option>
                                        <option value="0">No Tax</option>
                                        <option value="0.02">2% Tax</option>
                                        <option value="0.10">10% Tax</option>
                                        <option value="0.15">15% Tax</option>
                                    </select>
                                </div>
                                <button className="btn btn-sm zbtn" onClick={async () => {await addProducts()}}>
                                    <i className="bx bx-add-to-queue" style={{fontSize: '20px', transform: `translateY(10%)`}} />
                                </button>
                            </li>
                        )
                    }
                </ol>

                {
                    (infoFields.status != "paid" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Finance, UserRoles.BranchManager, UserRoles.Admin])) && (
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <button className="btn zbtn my-2" onClick={formSubmit}>
                                { (infoFields.sys_id ? "Update" : "Create") }
                            </button>
                        </div>
                    )
                }

                {
                    (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance]) && props.routeData.params.id != "-1" && infoFields.status == "confirmed") && (

                        <ol className="list-group list-group shadow-sm">
                            <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <div className="fw-bold fs-3">Transaction History</div>
                                    <div className="fw-bold fs-6"></div>
                                </div>
                            </li>

                            {
                                transactionHistory.map((prod: any) => (
                                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zpanel">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{prod.trx_number}</div>
                                            Paid On - {Utils.convertISOToDate(prod.created_on, localData.dateConfig)}
                                        </div>
                                        <span className="badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{Utils.formatPrice(prod.amount, "ETB")}</span>
                                    </li>
                                ))
                            }

                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-2 pt-4 zpanel">
                                <input
                                    className="form-control form-control-sm zinput mx-1 py-1 w-75"
                                    value={transactionInputs.amount}
                                    onChange={(event: any) => {updateTransactionInputs("amount", event.target.value, FieldTypes.FLOAT)}}
                                    placeholder="Payment Amount"
                                />
                                <button className="btn btn-sm zbtn py-1" onClick={async () => {await addTransaction()}}>
                                    <i className="bx bx-add-to-queue me-3" style={{fontSize: '20px', transform: `translateY(10%)`}}  />
                                    Paid
                                </button>
                            </li>
                        </ol>
                    )
                }

            </div>
            <div className="col mx-1 zpanel rounded-top-3 shadow-sm px-0 h-100" style={{overflow: "hidden auto"}}>
                {
                    (props.routeData.params.id && props.routeData.params.id != "-1") && (
                        <RecordActivity tableName="purchase" recordId={props.routeData.params.id} />
                    )
                }
            </div>
            <div className="col mx-1 zpanel p-0 rounded-top-3 shadow-sm h-100" style={{overflow: "hidden auto"}}>
                {
                    (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance])) ? (
                        <FormAttachment tableName="purchase" recordId={props.routeData.params.id} canAddAttachment={props.routeData.params.id == "-1" ? [] : [UserRoles.Admin]} />
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

export default CreatePurchase;