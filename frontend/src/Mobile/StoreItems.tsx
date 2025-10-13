import React, { useContext, useEffect, useState } from "react";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";


const StoreItems = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);

    const [sells, setSells] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [listType, setListType] = useState<("store_item" | "store_product")>("store_item");
    const [localWaiting, setLocalWaiting] = useState(false);

    useEffect(() => {
        loadData();
    }, [listType]);

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

            let result = await MainAPI.getAll(cookies.login_token, listType, 0, 0, {}, "reference");
            if(listType == "store_item") {
                setSells(result.Items);
            } else {
                setProducts(result.Items);
            }
            // setAlert(error.message, "error");

        } catch(error: any) {
            setAlert(error.message, "error");
        }
        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="h-100">
            {
                (!localWaiting) ? (
                    <div className="px-3 mt-3 pb-1">
                        {/* <div className="container my-3 zpanel px-3 py-2 rounded-3 shadow-sm">
                            <div className="search-bar d-flex justify-content-between align-items-center">
                                <i className="bx bx-search" style={{fontSize: '20px'}}></i>
                                <input type="text" className="form-control zinput mx-2 border-0 py-1" placeholder="Search" />
                                <i className="bx bx-filter" style={{fontSize: '20px'}}></i>
                            </div>
                        </div> */}

                        <div className="category-tabs d-flex my-2">
                            <button className="btn zbtn-outline btn-sm mx-1" onClick={() => {setListType("store_item")}}>Row Materials</button>
                            <button className="btn zbtn-outline btn-sm mx-1" onClick={() => {setListType("store_product")}}>Finished Products</button>
                        </div>

                        {

                            (listType == "store_item") ? (
                                sells.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{height: '200px'}}>
                                        <div className="card border-0 shadow-sm rounded-4 px-4 py-3 text-center">
                                            <i className="bx bx-package fs-1 text-muted mb-2"></i>
                                            <h6 className="mb-0 text-muted">No row materials found</h6>
                                        </div>
                                    </div>
                                ) : (
                                    sells.map((item: any) => {
                                        let found_choice = getDisplaySelect("store_item.level_state", item.level_state);
                                        return (
                                            <div className="card shadow-sm mb-3 border-0 zpanel">
                                                <div className="card-body d-flex align-items-center">
                                                    <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                                                    <div className="ms-3 flex-grow-1">
                                                        <small className="" style={{color: "var(--text_color)"}}>#{item.inventoryItem.item_number}</small>
                                                        <h6 className="mb-1">{item.inventoryItem.name}</h6>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            {/* <p className="mb-0"><b className="fs-5">{sell.total_price}</b>ETB</p> */}
                                                            <p className="mb-0" style={{color: "var(--text_color)"}}>{item.quantity} {item.inventoryItem.measuring_unit}</p>
                                                            <span 
                                                                className="badge rounded-pill py-1 px-3"
                                                                style={{background: found_choice.bgColor, color: found_choice.color, paddingTop: "5px !important", lineHeight: 1}}
                                                            >
                                                                {found_choice ? found_choice.label : "NULL"}
                                                                
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )
                            ) : (
                                products.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{height: '200px'}}>
                                        <div className="card border-0 shadow-sm rounded-4 px-4 py-3 text-center">
                                            <i className="bx bx-package fs-1 text-muted mb-2"></i>
                                            <h6 className="mb-0 text-muted">No finished products found</h6>
                                        </div>
                                    </div>
                                ) : (
                                    products.map((item: any) => {
                                        let found_choice = getDisplaySelect("store_product.level_state", item.level_state);
                                        return (
                                            <div className="card shadow-sm mb-3 border-0 zpanel">
                                                <div className="card-body d-flex align-items-center">
                                                    <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                                                    <div className="ms-3 flex-grow-1">
                                                        <small className="" style={{color: "var(--text_color)"}}>#{item.ItemProduct.product_number}</small>
                                                        <h6 className="mb-1" style={{color: "var(--text_color)"}}>{item.ItemProduct.name}</h6>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            {/* <p className="mb-0"><b className="fs-5">{sell.total_price}</b>ETB</p> */}
                                                            <p className="mb-0" style={{color: "var(--text_color)"}}>{item.quantity} {item.ItemProduct.measuring_unit}</p>
                                                            <span 
                                                                className="badge rounded-pill py-1 px-3"
                                                                style={{background: found_choice.bgColor, color: found_choice.color, paddingTop: "5px !important", lineHeight: 1}}
                                                            >
                                                                {found_choice ? found_choice.label : "NULL"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )
                            )
                        }

                    </div>
                ) : (
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

export default StoreItems;