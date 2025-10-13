import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";

function CustomersFrequencyReport(props: {fromDate: string, toDate: string}) {
    const { cookies } = useContext(AuthContext);
    const [mainData, setMainData] = useState<any[]>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, [props]);

    const loadData = async () => {
        setTimeout(() => { setLocalLoading(true); }, 10);
        let final_data: any[] = [];
        // Get all customers
        let customers_result = await MainAPI.getReportData(cookies.login_token, "customer", 0, 0, {});
        // Get all sells in date range
        let sells_result = await MainAPI.getReportData(cookies.login_token, "sell", 0, 0, {
            sold_date: { gte: props.fromDate, lt: props.toDate },
            status: {not: "draft"}
        });
        for (let customer of customers_result.Items) {
            const customerSells = sells_result.Items.filter((sell: any) => sell.customer_id === customer.sys_id);
            final_data.push({
                customer,
                sellCount: customerSells.length,
                paidAmount: customerSells.reduce((acc: number, curr: any) => acc + (curr.paid_price || 0), 0),
                unpaidAmount: customerSells.reduce((acc: number, curr: any) => acc + (curr.remaining_price || 0), 0)
            });
        }
        setMainData(final_data);
        setTimeout(() => { setLocalLoading(false); }, 20);
    };

    return (
        <div className="card border-0 zpanel mb-3">
            <div className="card-body">
                <div className="w-100 px-2" id="report_container">
                    <div className="d-flex justify-content-between w-100 mb-1">
                        <h3 className="card-title fs-4"><b>Customer Frequency Report</b></h3>
                    </div>
                    <div className="w-100" id="table_report">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>Sell Count</th>
                                    <th>Paid Amount</th>
                                    <th>Uncollected Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainData.filter((md: any) => (md.sellCount > 0)).map((md: any) => (
                                    <tr key={md.customer.sys_id}>
                                        <td>{md.customer.name}</td>
                                        <td>{md.customer.phone_number}</td>
                                        <td>{md.sellCount}</td>
                                        <td>{Utils.formatPrice(md.paidAmount, "ETB")}</td>
                                        <td>{Utils.formatPrice(md.unpaidAmount, "ETB")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {localLoading && (
                <div className="d-flex justify-content-center align-items-center h-100 w-100" style={{position: "absolute", top: 0, left: 0, backgroundColor: "rgba(255, 255, 255, 0.8)"}}>
                    <div className="spinner-border" style={{color: 'var(--button_bg)'}} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomersFrequencyReport;
