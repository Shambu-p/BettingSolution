import React, { useContext, useEffect, useState } from "react";
import MainAPI from "../APIs/MainAPI";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";

const ExpenseReport = (props: {fronmDate: string, toDate: string}) => {

    const {cookies} = useContext(AuthContext);
    const [mainData, setMainData] = useState<any[]>([]);
    const [groupedData, setGroupedData] = useState<any[]>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);

    useEffect(() => {
        // Simulate fetching data from an API
        loadData();
    }, [props]);

    const loadData = async () => {

        setTimeout(() => {setLocalLoading(true);}, 10);
        let all_expenses = [
            {id: "other_expences", name: "Other Expenses"},
            {id: "tax_paid", name: "Prepaid Tax"},
            {id: "service_fee", name: "Service Fee"},
            {id: "purchase", name: "Purchases"},
            {id: "tax", name: "Tax"}
        ];

        const response = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
            AND: [
                {
                    created_on: {gte: props.fronmDate},
                    type: "debit",
                    category: {in: all_expenses.filter(exp => exp.id !== "tax").map(exp => exp.id)}
                },
                {created_on: {lt: props.toDate}},
            ]
        });
        const tax_response = await MainAPI.getReportData(cookies.login_token, "transaction", 0, 0, {
            AND: [
                {
                    created_on: {gte: props.fronmDate},
                    type: "credit",
                    category: "tax"
                },
                {created_on: {lt: props.toDate}},
            ]
        });
        let temp_data: any = [];

        for(let expense of all_expenses) {
            if(expense.id === "tax") {
                temp_data.push({
                    id: `expense_row_${expense.id}`,
                    transactions: tax_response.Items,
                    type: expense.name
                });
            } else {

                temp_data.push({
                    id: `expense_row_${expense.id}`,
                    transactions: response.Items.filter(item => item.category === expense.id),
                    type: expense.name
                });
            }
        }
        setGroupedData(temp_data);
        setMainData(response.Items);

        setTimeout(() => {setLocalLoading(false);}, 10);

    };

    return (
        <div className="card shadow-sm zpanel border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between w-100 mb-1">
                    <h3 className="card-title fs-4"><b>Expense Report</b></h3>
                </div>
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Expense Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            groupedData.map((expense, idx) => {

                                if(expense.id === "expense_row_other_expences") {
                                    return (
                                        <tr key={expense.id}>
                                            <td>{expense.type}</td>
                                            <td>{Utils.ceilOrTruncate(expense.transactions.reduce((acc: number, item: any) => (acc + item.amount), 0) - mainData.filter(item => (item.category == "tax_paid" && !item.purchase_id)).reduce((acc: number, item: any) => (acc + item.amount), 0))}</td>
                                        </tr>
                                    )
                                } else {
                                    return (
                                        <tr key={expense.id}>
                                            <td>{expense.type}</td>
                                            <td>{Utils.ceilOrTruncate(expense.transactions.reduce((acc: number, item: any) => (acc + item.amount), 0))}</td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        <tr key="total_expense_amount">
                            <td>Total Amount</td>
                            <td>{Utils.ceilOrTruncate(mainData.reduce((acc: number, item: any) => acc + item.amount, 0))}</td>
                        </tr>
                    </tbody>
                </table>
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
};

export default ExpenseReport;