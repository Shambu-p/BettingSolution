import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";


function UncollectedSellsDeilyReport(props: {fromDate: string, toDate: string, seller: string}) {

    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    const [mainData, setMainData] = useState<any>({});
    const [localLoading, setLocalLoading] = useState<boolean>(false);


    useEffect(() => {
        loadData();
    }, [props]);


    const loadData = async () => {
        
        setTimeout(() => {setLocalLoading(true);}, 10);

        let final_data: any = {};
        let sell_transactions = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
            AND: [
                { sell: { sold_date: { lt: props.toDate } } },
                {
                    category: "sell",
                    sell: {
                        created_by: props.seller,
                        sold_date: {gte: props.fromDate}
                    },
                },
            ]
        });

        for(let sell of sell_transactions.Items) {

            if(!final_data[sell.sell.sys_id]) {

                final_data[sell.sell.sys_id] = {
                    credit: 0,
                    debit: 0,
                    data: sell.sell
                };

            }

            if(sell.type == "credit") {
                final_data[sell.sell.sys_id].credit += sell.amount;
            }

            if(sell.type == "debit") {
                final_data[sell.sell.sys_id].debit += sell.amount;
            }

        }


        setMainData(Object.values(final_data));
        setTimeout(() => {setLocalLoading(false);}, 20);

    };

    const capitalizeWords = (str: string) => {
        if (!str) return "";
        return str.replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());
    }

    return (
        <div className="card border-0 zpanel mb-3">
            <div className="card-body px-0">
                    <div className="w-100 px-2" id="report_container">
                        <div className="d-flex justify-content-between w-100 mb-1">
                        <h5 className="card-title"><b>Uncollected Sells</b></h5>
                    </div>
                    <div className="w-100" id="table_report" style={{overflowX: "auto"}}>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Sell Number</th>
                                    <th>Paid Amount</th>
                                    <th>Remaining Amount</th>
                                    <th>Current Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.values<{
                                        credit: number,
                                        debit: number,
                                        data: any
                                    }>(mainData).filter(md => ((md.credit - md.debit) > 0.01)).map((md) => (
                                        <tr>
                                            <td>{md.data.sell_number}</td>
                                            <td>{Utils.formatPrice(Utils.ceilOrTruncate(md.debit), "ETB")}</td>
                                            <td>{Utils.formatPrice(Utils.ceilOrTruncate(md.credit - md.debit), "ETB")}</td>
                                            {/* status string should start with capital letter */}
                                            <td>{capitalizeWords(md.data.status)}</td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td>Total</td>
                                    <td>{Utils.formatPrice(Utils.ceilOrTruncate(parseFloat(Object.values<any>(mainData).reduce((acc: number, md: any) => (acc + md.debit), 0))), "ETB")}</td>
                                    <td>{Utils.formatPrice(Utils.ceilOrTruncate(parseFloat(Object.values<any>(mainData).reduce((acc: number, md: any) => (acc + parseFloat(`${md.credit - md.debit}`)), 0))), "ETB")}</td>
                                    <td></td>
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

export default UncollectedSellsDeilyReport;