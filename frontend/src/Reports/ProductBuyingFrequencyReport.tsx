import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import MainAPI from "../APIs/MainAPI";

function ProductBuyingFrequencyReport(props: {fromDate: string, toDate: string}) {

    const { cookies } = useContext(AuthContext);
    const [mainData, setMainData] = useState<any[]>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, [props]);

    const loadData = async () => {
        setTimeout(() => { setLocalLoading(true); }, 10);
        // Fetch sell_product records in date range, with product reference
        let sellProductsResult = await MainAPI.getReportData(
            cookies.login_token,
            "sell_product",
            0,
            0,
            {
                Sell: {
                    AND: [
                        { sold_date: { gte: props.fromDate } },
                        { sold_date: { lt: props.toDate } },
                        { status: { not: "draft" } },
                        { status: { not: "cancelled" } }
                    ]
                }
            }
        );
        // Group by product_id
        let grouped: {[key: string]: any} = {};
        for (let sp of sellProductsResult.Items) {
            const productId = sp.product_id;
            if (!grouped[productId]) {
                grouped[productId] = {
                    product: sp.sellProduct,
                    timesBought: 0,
                    quantityBought: 0,
                    totalPrice: 0
                };
            }
            grouped[productId].timesBought += 1;
            grouped[productId].quantityBought += sp.quantity;
            grouped[productId].totalPrice += sp.total_price || 0;
            // If product reference is available, update
            if (sp.product && typeof sp.product === 'object') {
                grouped[productId].product = sp.product;
            }
        }
        // Convert to array
        let finalData = Object.values(grouped);
        setMainData(finalData);
        setTimeout(() => { setLocalLoading(false); }, 20);
    };

    return (
        <div className="card border-0 zpanel mb-3">
            <div className="card-body">
                <div className="w-100 px-2" id="report_container">
                    <div className="d-flex justify-content-between w-100 mb-1">
                        <h3 className="card-title fs-4"><b>Product Selling Frequency Report</b></h3>
                    </div>
                    <div className="w-100" id="table_report">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity Bought</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainData.map((md: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>{md.product?.name || md.product || "Unknown"}</td>
                                        <td>{md.quantityBought} {md.product.measuring_unit}</td>
                                        <td>{Utils.formatPrice(Utils.ceilOrTruncate(md.totalPrice * 1.15), "ETB")}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td>{mainData.reduce((acc: number, md: any) => (acc + md.quantityBought), 0)}</td>
                                    <td>{Utils.formatPrice(Utils.ceilOrTruncate(mainData.reduce((acc: number, md: any) => (acc + (md.totalPrice * 1.15)), 0)), "ETB")}</td>
                                </tr>
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

export default ProductBuyingFrequencyReport;
