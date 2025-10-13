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


const CreateSell = (props: any) => {

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
        customers: [],
        deliveries: []
    });
    const [localWaiting, setLocalWaiting] = useState(false);
    const [inputFields, setInputFields] = useState<any>({
        product_id: "",
        quantity: ""
    });
    const [infoFields, setInfoFields] = useState<any>({
        sell_number: "",
        store_id: "",
        customer_id: "",
        delivery_id: "",
        discount: 0,
        tax_percentage: 0,
        tax_amount: 0,
        paid_price: 0,
        remaining_price: 0,
        status: "draft",
        has_receipt: true
    });

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    useEffect(() => {
        loadProducts()
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
                let result = await MainAPI.getSingle(cookies.login_token, "sell", props.routeData.params.id);
                let found_products = await MainAPI.getAll(cookies.login_token, "sell_product", 0, 0, {
                    sell_id: {
                        type: FieldTypes.TEXT,
                        operator: Operators.IS,
                        value: result.sys_id
                    },
                }, "reference");
                setProducts(found_products.Items);
                setInfoFields(result);
                props.updatePageTitle(result.sell_number);
                // setAlert(error.message, "error");

                if(Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) && result.status != "draft") {

                    let found_transactions = await MainAPI.getAll(cookies.login_token, "transaction", 0, 0, {
                        sell_id: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: result.sys_id
                        },
                        type: {
                            type: FieldTypes.TEXT,
                            operator: Operators.IS,
                            value: TransactionType.Debit
                        },
                    }, "reference");
                    setTransactionHistory(found_transactions.Items);

                }

            } else {
                props.updatePageTitle("New Sell Form");
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

            // temp_data.products = (await MainAPI.getAll(cookies.login_token, "product", 0, 0, {})).Items;
            temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;
            temp_data.deliveries = (await MainAPI.getAll(cookies.login_token, "delivery", 0, 0, {})).Items;
            temp_data.customers = (await MainAPI.getAll(cookies.login_token, "customer", 0, 0, {
                type: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: 'customer'
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

    const loadProducts = async () => {
            
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {
            let store_products = (await MainAPI.getAll(cookies.login_token, "store_product", 0, 0, {
                store_id: {
                    type: FieldTypes.TEXT,
                    operator: Operators.IS,
                    value: infoFields.store_id
                },
            }, "reference")).Items;
            setSelectData((prev: any) => ({ ...prev, products: store_products.map((prd: any) => ({...prd.ItemProduct, quantity: prd.quantity}))}));
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

                if((infoFields.has_receipt != true && infoFields.has_receipt != false) || !infoFields.store_id || !infoFields.customer_id) {
                    throw Error("Before Submitting please make sure you have filled all the necessary fields!")
                }

                let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "sell", {
                    ...infoFields,
                    discount: parseFloat(infoFields.discount),
                    tax_percentage: parseFloat(infoFields.tax_percentage)
                });

                for(let prod of products) {

                    children_result = await MainAPI.createNew(cookies.login_token, "sell_product", {
                        sell_id: parent_result.sys_id,
                        product_id: prod.sellProduct.sys_id,
                        store_id: infoFields.store_id,
                        quantity: parseFloat(prod.quantity)
                    });

                }

                props.mainNavigation({
                    id: (isMobile ? `/mobile/create-sell/${parent_result.sys_id}` : `/create-sell/${parent_result.sys_id}`),
                    routeAddress: (isMobile ? `/mobile/create-sell/${parent_result.sys_id}` : `/create-sell/${parent_result.sys_id}`),
                    title: "Loading...",
                    type: "page",
                    table: "",
                    rec_id: "",
                    dashboard_id: "create-sell",
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
                let result = await MainAPI.update(cookies.login_token, "sell", {
                    ...infoFields,
                    discount: parseFloat(infoFields.discount),
                    tax_percentage: parseFloat(infoFields.tax_percentage)
                });

                loadData();
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const addProducts = async () => {

        let found_product = selectData.products.find((prd: any) => (prd.sys_id == inputFields.product_id));
        if(found_product) {

            if(props.routeData.params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result = await MainAPI.createNew(cookies.login_token, "sell_product", {
                        sell_id: infoFields.sys_id,
                        product_id: found_product.sys_id,
                        store_id: infoFields.store_id,
                        quantity: parseFloat(inputFields.quantity)
                    });

                    setProducts((prod: any) => ([...prod, {
                        sellProduct: found_product,
                        quantity: parseFloat(inputFields.quantity)
                    }]));

                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {
                setProducts((prod: any) => ([...prod, {
                    sellProduct: found_product,
                    quantity: parseFloat(inputFields.quantity)
                }]));
            }

        }

        setInputFields((fld: any) => ({
            product_id: "",
            quantity: ""
        }))

    }

    const addTransaction = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);

        try {

            let transaction_result = await MainAPI.createNew(cookies.login_token, "transaction", {
                ...transactionInputs,
                amount: parseFloat(transactionInputs.amount),
                trx_number: undefined,
                sell_id: infoFields.sys_id
            });

            loadData();
            // setTransactionHistory((prod: any) => ([...prod, {...transaction_result}]));

        } catch(error) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

        setTransactionInputs((fld: any) => ({
            ...fld,
            amount: 0
        }));

    }

    const deleteProducts = async (id: string) => {
        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(props.routeData.params.id == "-1") {
                setProducts((prev: any) => (prev.filter(prv => (prv.sellProduct.sys_id != id))));
            } else {

                let result = await MainAPI.deleteList(cookies.login_token, "sell_product", [id]);
                setAlert(`${result.found.length} records were requested to be deleted and ${result.deleted.length} records has been deleted.`);

            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);
    }

    return (
        <div className="row m-0 h-100 mt-3" >
            <div className="col-sm-12 col-md-6">

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3">{ (props.routeData.params.id && props.routeData.params.id != "-1") ? infoFields.sell_number : "New Sells" }</div>
                            <div className="btn-group">
                                <button className="btn btn-secondary btn-sm px-3" type="button">
                                    {getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}
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
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]) && infoFields.status == "draft") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "cancelled", FieldTypes.TEXT)}, 10)}}>Cancel Sell</button></li>
                                        )
                                    }
                                    {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]) && infoFields.status == "draft") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "sold", FieldTypes.TEXT)}, 10)}}>Confirm Sell</button></li>
                                        )
                                    }
                                    {/*
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]) && ["sold", "on_the_way"].includes(infoFields.status)) && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "delivered", FieldTypes.TEXT)}, 10)}}>Finish Sell</button></li>
                                        )

                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]) && infoFields.status == "sold") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "delivery_assigned", FieldTypes.TEXT)}, 10)}}>Assign Delivery</button></li>
                                        )
                                    */}
                                    {
                                        (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells]) && infoFields.status == "delivery_assigned") && (
                                            <li><button className="dropdown-item" onClick={() => {setTimeout(() => {updateInfoFields("status", "on_the_way", FieldTypes.TEXT)}, 10)}}>On The Way</button></li>
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

                        {(props.routeData.params.id && props.routeData.params.id != "-1") ? Utils.isoToReadableDateTime(infoFields.created_on, localData.dateConfig) : (new Date()).toISOString()}
                        <div className="d-flex justify-content-between mt-2">
                            <div>{Utils.formatPrice(infoFields.paid_price, "ETB")} Paid</div>
                            <div>{Utils.formatPrice(infoFields.remaining_price, "ETB")} Remaining</div>
                        </div>
                    </div>
                </div>

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" disabled={(!Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) || (props.routeData.params.id && props.routeData.params.id != "-1"))} value={infoFields.store_id} onChange={(event: any) => {updateInfoFields("store_id", event.target.value)}} >
                            <option value="">From Store</option>
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
                                        routeAddress: `/form/store/${infoFields.store_id}`,
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
                                        routeAddress: `/form/store/-1`,
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

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-user-pin" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" disabled={(props.routeData.params.id && props.routeData.params.id != "-1")} value={infoFields.customer_id} onChange={(event: any) => {updateInfoFields("customer_id", event.target.value)}} >
                            <option value="">Customer/Buyer</option>
                            {
                                selectData.customers.map((str: any) => (
                                    <option value={str.sys_id} selected={(str.sys_id == infoFields.customer_id)}>{str.name}</option>
                                ))
                            }
                        </select>
                        {
                            infoFields.customer_id && (
                                <button className="btn btn-sm zbtn" onClick={async () => {
                                    props.mainNavigation({
                                        id: `/form/customer/${infoFields.customer_id}`,
                                        routeAddress: `/form/customer/${infoFields.customer_id}`,
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
                            Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) && (
                                <button className="btn btn-sm zbtn ms-2" onClick={async () => {
                                    props.mainNavigation({
                                        id: (isMobile ? `/mobile/customer_form/-1` : `/form/customer/-1`),
                                        routeAddress: (isMobile ? `/mobile/customer_form/-1` : `/form/customer/-1`),
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

                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-end">
                        <MoneyOffIcon style={{fontSize: '20px'}} />
                        <div className="w-100">
                            <div className="label mb-1">Discount Percentage</div>
                            <input type="text" className="form-control zinput mx-2 border-0 py-1" readOnly={(["sold", "paid"].includes(infoFields.status))} value={infoFields.discount} onChange={(event: any) => {updateInfoFields("discount", event.target.value, FieldTypes.FLOAT)}} placeholder="Discount Percentage" />
                        </div>
                    </div>
                </div>
                <div className="w-100 my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar">
                        <div className="w-100 d-flex align-items-end">
                            <ReceiptIcon style={{fontSize: '20px'}} className="mb-1 me-1" />
                            <div className="d-flex w-100">
                                <div className="col px-1">
                                    <div className="label mb-2">Has Receipt</div>
                                    <select className="form-control zinput border-0 py-1" value={infoFields.has_receipt} disabled={(["sold", "paid"].includes(infoFields.status))} onChange={(event: any) => {updateInfoFields("has_receipt", (event.target.value == "true"), FieldTypes.BOOLEAN)}} >
                                        <option value="false" selected={!infoFields.has_receipt}>No Receipt</option>
                                        <option value="true" selected={infoFields.has_receipt}>Receipt</option>
                                    </select>
                                </div>
                                <div className="col px-1">
                                    <div className="label mb-2">Tax Amount</div>
                                    <input type="number" className="form-control zinput mx-1 py-1" value={infoFields.tax_amount} disabled={true} placeholder="Tax Amount" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ol className="list-group list-group shadow-sm mb-2">
                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <div className="fw-bold fs-3">Select Products</div>
                            <div className="fw-bold fs-6">{Utils.formatPrice(products.reduce((acc: number, crr: any) => (acc + (crr.sellProduct.unit_price * crr.quantity)), 0), "ETB")}</div>
                        </div>
                    </li>


                    {
                        products.map((prod: any) => (
                            <li className="list-group-item p-0 d-flex border-0 border-bottom zpanel w-100">
                                <div className="px-3 py-2 w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="fw-bold">
                                            {prod.sellProduct.name}
                                        </div>
                                        {
                                            (Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells])) && (
                                                <span className="ms-auto badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{Utils.formatPrice(prod.quantity*prod.sellProduct.unit_price, "ETB")}</span>
                                            )
                                        }
                                    </div>
                                    {prod.quantity} {getDisplaySelect("product.measuring_unit", prod.sellProduct.measuring_unit).label}
                                </div>
                                {
                                    (infoFields.status == "draft") && (
                                        <div className="col">
                                            <button 
                                                className="btn btn-outline-danger px-2 py-2 rounded-0 h-100"
                                                title="Delete this Consumption Item?"
                                                onClick={() => {deleteProducts(props.routeData.params.id == "-1" ? prod.sellProduct.sys_id : prod.sys_id)}}
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
                        (infoFields.status == "draft") && (
                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-2 pt-4 zpanel">
                                <select className="form-control form-control-sm zinput me-1 py-1" value={inputFields.product_id} onChange={(event: any) => {updateInput("product_id", event.target.value)}} >
                                    <option value="">Select Product</option>
                                    {
                                        selectData.products.map((prd: any) => (
                                            <option value={prd.sys_id}>{prd.name} - {prd.quantity}</option>
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
                        {((props.routeData.params.id && props.routeData.params.id != "-1") ? "Update" : "Sell")}
                    </button>
                </div>

                {
                    (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells]) && infoFields.status != "draft") && (
                        <ol className="list-group list-group shadow-sm mt-4 mb-3">
                            <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <div className="fw-bold fs-3">Payment History</div>
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

                            {
                                (infoFields.status != "paid" || infoFields.remaining_price >= 1) && (
                                    <li className="list-group-item d-flex justify-content-between align-items-end border-0 px-2 pt-4 zpanel">
                                        <div className="w-100 me-2">
                                            <div className="label w-100 mb-1">Paid Amount</div>
                                            <input
                                                className="form-control form-control-sm zinput py-1"
                                                value={transactionInputs.amount}
                                                onChange={(event: any) => {updateTransactionInputs("amount", event.target.value, FieldTypes.FLOAT)}}
                                                placeholder="Payment Amount"
                                            />
                                        </div>
                                        <button className="btn btn-sm zbtn py-1" onClick={async () => {await addTransaction()}}>
                                            {/* <i className="bx bx-add-to-queue me-3" style={{fontSize: '20px', transform: `translateY(10%)`}} onClick={async () => {await addTransaction()}} /> */}
                                            Paid
                                        </button>
                                    </li>
                                )
                            }
                        </ol>
                    )
                }


            </div>

            {
                (!isMobile) && (
                    <div className="col mx-1 zpanel rounded-top-3 shadow-sm" style={{overflow: "hidden auto"}}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1") && (
                                <RecordActivity tableName="sell" recordId={props.routeData.params.id} />
                            )
                        }
                    </div>
                )
            }

            {
                (!isMobile) && (
                    <div className="col mx-1 zpanel p-0 rounded-top-3 shadow-sm" style={{overflow: "hidden auto"}}>
                        {
                            (props.routeData.params.id && props.routeData.params.id != "-1" && Utils.roleCheck(loggedUser.Roles, [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells])) ? (
                                <FormAttachment tableName="sell" recordId={props.routeData.params.id} canAddAttachment={props.routeData.params.id == "-1" ? [] : [UserRoles.Admin]} />
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

export default CreateSell;