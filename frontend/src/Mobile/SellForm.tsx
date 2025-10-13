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


const SellForm = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
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
        status: "draft"
    });

    useEffect(() => {
        loadData();
        loadProducts();
    }, []);

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

            if(params.id && params.id != "-1") {
                let result = await MainAPI.getSingle(cookies.login_token, "sell", params.id);
                let found_products = await MainAPI.getAll(cookies.login_token, "sell_product", 0, 0, {
                    sell_id: result.sys_id
                }, "reference");
                setProducts(found_products.Items);
                setInfoFields(result);
                // setAlert(error.message, "error");
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const loadProducts = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            let temp_data = {
                products: [],
                stores: [],
                customers: [],
                deliveries: []
            };

            temp_data.products = (await MainAPI.getAll(cookies.login_token, "product", 0, 0, {})).Items;
            temp_data.stores = (await MainAPI.getAll(cookies.login_token, "store", 0, 0, {})).Items;
            temp_data.deliveries = (await MainAPI.getAll(cookies.login_token, "delivery", 0, 0, {})).Items;
            temp_data.customers = (await MainAPI.getAll(cookies.login_token, "customer", 0, 0, {})).Items;

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
        if(type == FieldTypes.FLOAT) {
            setInputFields((flds: any) =>({...flds, [field_name]: parseFloat(value)}));
        } else if(type == FieldTypes.NUMBER) {
            setInputFields((flds: any) =>({...flds, [field_name]: parseInt(value)}));
        } else {
            setInputFields((flds: any) =>({...flds, [field_name]: value}));
        }
    }

    const formSubmit = async () => {

        setTimeout(() => {setLocalWaiting(true);}, 10);
        try {

            if(params.id && params.id == "-1") {

                let children_result = null;
                let parent_result = await MainAPI.createNew(cookies.login_token, "sell", {
                    ...inputFields
                });

                for(let prod of products) {

                    children_result = await MainAPI.createNew(cookies.login_token, "sell_product", {
                        sell_id: parent_result.sys_id,
                        product_id: prod.sellProduct.sys_id,
                        store_id: infoFields.store_id,
                        quantity: prod.quantity
                    });

                }

                navigate("/mobile/customers");
                // setAlert(error.message, "error");

            } else if(params.id) {
                let result = await MainAPI.update(cookies.login_token, "sell", {
                    ...inputFields
                });
            }

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    const addProducts = async () => {

        let found_product = selectData.products.find((prd: any) => (prd.sys_id == inputFields.product_id));
        if(found_product) {

            if(params.id != "-1") {

                setTimeout(() => {setLocalWaiting(true);}, 10);

                try {

                    let children_result = await MainAPI.createNew(cookies.login_token, "sell_product", {
                        sell_id: infoFields.sys_id,
                        product_id: found_product.sys_id,
                        store_id: infoFields.store_id,
                        quantity: inputFields.quantity
                    });

                    setProducts((prod: any) => ([...prod, {
                        sellProduct: found_product,
                        quantity: inputFields.quantity
                    }]));

                } catch(error) {
                    setAlert(error.message, "error");
                }

                setTimeout(() => {setLocalWaiting(false);}, 10);

            } else {
                setProducts((prod: any) => ([...prod, {
                    sellProduct: found_product,
                    quantity: inputFields.quantity
                }]));
            }

        }

        setInputFields((fld: any) => ({
            product_id: "",
            quantity: ""
        }))

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
        <div className="h-100" style={{display: "flex", flexDirection: "column", overflow: "hidden auto"}}>
            <div className="mx-2 h-100 mt-3">

                <div className="d-flex justify-content-between align-items-start zbtn p-2 rounded-top">
                    <div className="ms-2 w-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="fw-bold fs-3">{ (params.id == "-1") ? "New Sell" : infoFields.sell_number }</div>
                            <div className="btn-sm btn-primary btn">{getDisplaySelect("sell.status", infoFields.status).label ?? "Draft"}</div>
                        </div>
                        {(params.id == "-1") ? (new Date()).toISOString() : Utils.isoToDateTimeLocal(infoFields.created_on)}
                        <div className="d-flex justify-content-between mt-2">
                            <div>{infoFields.paid_price}ETB Paid</div>
                            <div>{infoFields.remaining_price}ETB Remaining</div>
                        </div>
                    </div>
                </div>

                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-store" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={inputFields.store_id} onChange={(event: any) => {updateInput("store_id", event.target.value)}} >
                            <option value="">From Store</option>
                            {
                                selectData.stores.map((str: any) => (
                                    <option value={str.sys_id} selected={(str.sys_id == infoFields.store_id)}>{str.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bx-user-pin" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={inputFields.customer_id} onChange={(event: any) => {updateInput("customer_id", event.target.value)}} >
                            <option value="">Customer/Buyer</option>
                            {
                                selectData.customers.map((str: any) => (
                                    <option value={str.sys_id} selected={(str.sys_id == infoFields.customer_id)}>{str.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                {/* <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <i className="bx bxs-truck" style={{fontSize: '20px'}}></i>
                        <select className="form-control zinput mx-2 border-0 py-1" value={inputFields.delivery_id} onChange={(event: any) => {updateInput("delivery_id", event.target.value)}} >
                            <option value="">Delivery</option>
                            {
                                selectData.deliveries.map((str: any) => (
                                    <option value={str.sys_id} selected={(str.sys_id == infoFields.delivery_id)}>{str.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div> */}
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <MoneyOffIcon style={{fontSize: '20px'}} />
                        <input type="text" className="form-control zinput mx-2 border-0 py-1" value={inputFields.discount} onChange={(event: any) => {updateInput("discount", event.target.value, FieldTypes.FLOAT)}} placeholder="Discount Percentage" />
                    </div>
                </div>
                <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                    <div className="search-bar d-flex justify-content-between align-items-center">
                        <ReceiptIcon style={{fontSize: '20px'}} />
                        <input type="number" className="form-control zinput ms-2 me-1 py-1" value={inputFields.tax_percentage} onChange={(event: any) => {updateInput("tax_percentage", event.target.value, FieldTypes.FLOAT)}} placeholder="Tax Percentage" />
                        <input type="number" className="form-control zinput mx-1 py-1" value={inputFields.tax_amount} readOnly={true} placeholder="Tax Amount" />
                    </div>
                </div>

                <ol className="list-group list-group shadow-sm">
                    <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zbtn">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <div className="fw-bold fs-3">Select Products</div>
                            <div className="fw-bold fs-6">{Utils.formatPrice(products.reduce((acc: number, crr: any) => (acc + (crr.sellProduct.unit_price * crr.quantity)), 0), "ETB")}</div>
                        </div>
                    </li>

                    {
                        products.map((prod: any) => (
                            <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom zpanel">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{prod.sellProduct.name}</div>
                                    {prod.quantity}{prod.sellProduct.measuring_unit}
                                </div>
                                <span className="badge rounded-pill fs-6" style={{background: `var(--button_bg_hover)`}}>{prod.quantity*prod.sellProduct.unit_price}ETB</span>
                            </li>
                        ))
                    }

                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-2 pt-4 zpanel">
                        <select className="form-control form-control-sm zinput me-1 py-1" value={inputFields.product_id} onChange={(event: any) => {updateInput("product_id", event.target.value)}} >
                            <option value="">Select Product</option>
                            {
                                selectData.products.map((prd: any) => (
                                    <option value={prd.sys_id}>{prd.name}</option>
                                ))
                            }
                        </select>
                        <input className="form-control form-control-sm zinput mx-1 py-1" value={inputFields.quantity} onChange={(event: any) => {updateInput("quantity", event.target.value, FieldTypes.FLOAT)}} placeholder="Quantity" />
                        <button className="btn btn-sm zbtn ">
                            <i className="bx bx-add-to-queue" style={{fontSize: '20px', transform: `translateY(10%)`}} onClick={async () => {await addProducts()}} />
                        </button>
                    </li>
                </ol>

                <button className="btn zbtn my-2 w-100" onClick={formSubmit}>
                    Sell
                </button>

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

export default SellForm;