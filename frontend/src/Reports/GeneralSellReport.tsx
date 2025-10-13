import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";


function GeneralSellReport(props: {fromDate: string, toDate: string}) {

    const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);

    const [mainData, setMainData] = useState<any>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);


    useEffect(() => {
        loadData();
    }, [props]);


    const loadData = async () => {
        
        setTimeout(() => {setLocalLoading(true);}, 10);
        let final_data: any = [];
        let stores_result = await MainAPI.getReportData(cookies.login_token, "store", 0, 0, {});
        let sells_result = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
            AND: [
                {created_on: {gte: props.fromDate}},
                {created_on: {lt: props.toDate}},
                // { sell: {sold_date: {lt: props.toDate}}},
                // { sell: {sold_date: {gte: props.fromDate}}},
                // {created_by: selecteManager},
                {category: "sell"},
                {type: "debit"}
            ],
            sell: {
                AND: [
                    {sold_date: {lt: props.toDate}},
                    {sold_date: {gte: props.fromDate}}
                ]
            }
        });

        let repayment_result = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
            AND: [
                {created_on: {lt: props.toDate}},
                {
                    created_on: {gte: props.fromDate},
                    category: "sell",
                    type: "debit"
                },
            ]
        });

        let uncollected_result = await MainAPI.getReportData(cookies.login_token, "sell", 0, 0, {
            AND: [
                {
                    sold_date: {lt: props.toDate},
                    status: "sold",
                    remaining_price: {gte: 0.01}
                },
                {sold_date: {gte: props.fromDate}}
            ]
        });

        let transfer_result = await MainAPI.getReportData(cookies.login_token, "transfer_product", 0, 0, {
            Transfer: {
                status: "received",
                finished_on: {
                    gte: props.fromDate,
                    lt: props.toDate
                }
            }
        });

        for(let store of stores_result.Items) {
            final_data.push({
                store: store,
                sells: sells_result.Items.filter((transaction: any) => transaction.sell.store_id == store.sys_id),
                repayment: repayment_result.Items.filter((transaction: any) => (transaction.sell.store_id == store.sys_id && !Utils.isSameDay(transaction.created_on, transaction.sell.sold_date))),
                uncollected: uncollected_result.Items.filter((sell: any) => (sell.store_id == store.sys_id)),
                sellOrders: transfer_result.Items.filter((transfer: any) => (transfer.Transfer.store_to_id == store.sys_id))
            });
        }

        // for(let store of last_sold_result.Items) {
        //     final_data.push({
        //         store: store,
        //     });
        // }

        setMainData(final_data);
        setTimeout(() => {setLocalLoading(false);}, 20);

    };

    return (
        <div className="card border-0 zpanel mb-3">
            <div className="card-body">
                    <div className="w-100 px-2" id="report_container">
                        <div className="d-flex justify-content-between w-100 mb-1">
                        <h3 className="card-title fs-4"><b>Sell Report</b></h3>
                    </div>
                    <div className="w-100" id="table_report">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Store/Sells</th>
                                    <th>Collected</th>
                                    <th>Repayment</th>
                                    <th>Uncollected</th>
                                    <th>Sell Order Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mainData.map((md: any) => (
                                        <tr>
                                            <td>{md.store.name}</td>
                                            <td>{Utils.ceilOrTruncate(md.sells.reduce((acc: number, curr: any) => (acc + curr.amount), 0))}</td>
                                            <td>{Utils.ceilOrTruncate(md.repayment.reduce((acc: number, curr: any) => (acc + curr.amount), 0))}</td>
                                            <td>{Utils.ceilOrTruncate(md.uncollected.reduce((acc: number, curr: any) => (acc + curr.remaining_price), 0))}</td>
                                            <td>{Utils.ceilOrTruncate(md.sellOrders.reduce((acc: number, curr: any) => (acc + curr.total_price + (curr.total_price * 0.15)), 0))}</td>
                                        </tr>
                                    ))
                                }
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

export default GeneralSellReport;