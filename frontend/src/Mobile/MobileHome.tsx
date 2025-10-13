import React, { useContext, useEffect, useState } from "react";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useNavigate, useSearchParams } from "react-router-dom";
import MainAPI from "../APIs/MainAPI";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import Utils from "../Models/Utils";

const MobileHome = (props: any) => {

    const {loggedUser, cookies, localData} = useContext(AuthContext);
    const { setAlert, setWaiting, showWaiting, setMenu, menu } = useContext(AlertContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const [sells, setSells] = useState<any>({
        debit: 0,
        credit: 0,
        repayment: 0
    });
    const [transfers, setTransfers] = useState<number>(0);
    const [localWaiting, setLocalWaiting] = useState(false);

    useEffect(() => {
        loadData();
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

            let todayDate = (new Date());
            let tomorrowDate = (new Date());
            let yesterDay = (new Date());
            todayDate.setHours(0, 0, 0);
            
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            tomorrowDate.setHours(0, 0, 0);
            
            yesterDay.setHours(23, 59, 59);
            yesterDay.setDate(yesterDay.getDate() - 1);

            let result = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
                AND: [
                    {
                        created_on: { gte: todayDate.toISOString() },
                        // status: { not: "draft" },
                        category: "sell"
                    },
                    {
                        created_on: { lt: tomorrowDate.toISOString() }
                    }
                ],
                sell: {
                    store_id: { in: loggedUser.Stores }
                }
            });

            let transfer_result = await MainAPI.getReportData(cookies.login_token, "transfer_product", 0, 0, {
                Transfer: {
                    status: "received",
                    accepted_by: loggedUser.sys_id,
                    finished_on: {
                        gte: todayDate.toISOString(),
                        lt: tomorrowDate.toISOString()
                    }
                }
            });

            setSells({
                debit: result.Items.filter(itm => (itm.type == "debit" && (new Date(itm.sell.sold_date).getTime() >= todayDate.getTime()))).reduce((acc: number, current: any) => (acc + current.amount), 0),
                credit: result.Items.filter(itm => (itm.type == "credit")).reduce((acc: number, current: any) => (acc + current.amount), 0),
                repayment: result.Items.filter(itm => (itm.type == "debit" && (new Date(itm.sell.sold_date).getTime() < todayDate.getTime()))).reduce((acc: number, current: any) => (acc + current.amount), 0),
            });
            setTransfers((transfer_result.Items.length > 0) ? transfer_result.Items.reduce((acc, item) => (acc + (item.productItem.unit_price * item.quantity)), 0) : 0);
            // setAlert(error.message, "error");

        } catch(error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {setLocalWaiting(false);}, 10);

    }

    return (
        <div className="h-100 w-100" style={{display: "flex", flexDirection: "column"}}>
            <div className="zpanel p-3 shadow-sm rounded-3 my-2 mx-2" style={{ overflow: "auto hidden"}}>
                <h6 className="text-center mb-1 fs-6">Daily Sells</h6>
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <div className="col">
                        <h6 className="card-title text-center" style={{fontWeight: "bold", fontSize: "17px"}}>{Utils.ceilOrTruncate(transfers + (transfers * 0.15))}</h6>
                        <div className="w-100 text-center" style={{fontSize: "14px"}}>Product Received</div>
                    </div>
                    <div className="col">
                        <h6 className="card-title text-center" style={{fontWeight: "bold", fontSize: "17px"}}>{Utils.formatPrice((sells.debit + sells.repayment), "ETB")}</h6>
                        <div className="w-100 text-center" style={{fontSize: "14px"}}>Collected</div>
                    </div>
                    <div className="col">
                        <h6 className="card-title text-center" style={{fontWeight: "bold", fontSize: "17px"}}>{ Utils.formatPrice((sells.credit - sells.debit), "ETB")}</h6>
                        <div className="w-100 text-center" style={{fontSize: "14px"}}>Uncollected</div>
                    </div>
                </div>
            </div>
            <div className="row m-0 h-100">
                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 bg-success justify-content-center align-items-center h-100 w-100 shadow-sm"
                        style={{display: "flex", flexDirection: "column"}}
                        onClick={() => {navigate("/mobile/store_items")}}
                    >
                        <StoreMallDirectoryIcon sx={{ color: "white", fontSize: "80px"}} />
                        <span className="text-center text-white fs-5">Store Items</span>
                    </button>
                </div>
                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 bg-warning justify-content-center align-items-center h-100 w-100"
                        style={{display: "flex", flexDirection: "column"}}
                        onClick={() => {navigate("/mobile/sell_list")}}
                    >
                        <LocalGroceryStoreIcon sx={{ color: "black", fontSize: "80px"}} />
                        <span className="text-center text-dark fs-5">Sells</span>
                    </button>
                </div>

                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 bg-secondary justify-content-center align-items-center h-100 w-100"
                        style={{display: "flex", flexDirection: "column"}}
                        onClick={() => {navigate("/mobile/reports")}}
                    >
                        <BarChartIcon sx={{ color: "white", fontSize: "80px"}} />
                        <span className="text-center text-white fs-5">Reports</span>
                    </button>
                </div>
                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 bg-danger justify-content-center align-items-center h-100 w-100"
                        style={{display: "flex", flexDirection: "column"}}
                        onClick={() => {navigate("/mobile/sell_list?type=unpaid")}}
                    >
                        <ProductionQuantityLimitsIcon sx={{ color: "white", fontSize: "80px"}} />
                        <span className="text-center text-white fs-5">Unpaid Sells</span>
                    </button>
                </div>
                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 bg-primary justify-content-center align-items-center h-100 w-100"
                        style={{display: "flex", flexDirection: "column"}}
                        onClick={() => {navigate("/mobile/transfer_list")}}
                    >
                        {/* <BarChartIcon  /> */}
                        <i className='bx bx-transfer' style={{ color: "white", fontSize: "80px"}}></i>
                        <span className="text-center text-white fs-5">Product Request</span>
                    </button>
                </div>
                <div className="col-6 p-2" style={{height: "33%"}}>
                    <button 
                        className="btn rounded-4 justify-content-center align-items-center h-100 w-100"
                        style={{display: "flex", flexDirection: "column", background: "orange"}}
                        onClick={() => {navigate("/mobile/customers")}}
                    >
                        {/* <BarChartIcon sx /> */}
                        <i className='bx bxs-contact' style={{ color: "black", fontSize: "80px"}}></i>
                        <span className="text-center text-dark fs-5">Customers</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MobileHome;