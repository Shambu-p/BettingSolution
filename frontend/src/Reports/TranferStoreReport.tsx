import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";


function TransferStoreReport(props: {fromDate: string, toDate: string, receiver: string}) {

    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    const [mainData, setMainData] = useState<any>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);


    useEffect(() => {
        loadData();
    }, [props]);


    const loadData = async () => {
        
        setTimeout(() => {setLocalLoading(true);}, 10);

        let transfer_result = await MainAPI.getReportData(cookies.login_token, "transfer_product", 0, 0, {
            Transfer: {
                status: "received",
                finished_on: {
                    gte: props.fromDate,
                    lt: props.toDate
                },
                accepted_by: props.receiver
            }
        });

        setMainData(transfer_result.Items);
        setTimeout(() => {setLocalLoading(false);}, 20);

    };

    return (
        <div className="card border-0 zpanel mb-3">
            <div className="card-body">
                    <div className="w-100 px-2" id="report_container">
                        <div className="d-flex justify-content-between w-100 mb-1">
                        <h5 className="card-title"><b>Store Transfer Report</b></h5>
                    </div>
                    <div className="w-100" id="table_report">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Transfer</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mainData.map((md: any) => (
                                        <tr>
                                            <td>{md.productItem.name}</td>
                                            <td>{md.Transfer.transfer_number}</td>
                                            <td>{md.quantity} {md.productItem.measuring_unit}</td>
                                            <td>{Utils.ceilOrTruncate(md.total_price + (md.total_price * 0.15))}</td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td>{mainData.reduce((acc: number, md: any) => (acc + md.quantity), 0)}</td>
                                    <td>{Utils.ceilOrTruncate(mainData.reduce((acc: number, md: any) => (acc + md.total_price), 0) + (mainData.reduce((acc: number, md: any) => (acc + md.total_price), 0) * 0.15))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                (localLoading) && (
                    <div className="d-flex justify-content-center align-items-center h-100 w-100" style={{position: "absolute", top: 0, left: 0, backgroundColor: "rgba(255, 255, 255, 0.8)"}}>
                        <div className="spinner-border" style={{color: 'var(--button_bg)'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default TransferStoreReport;