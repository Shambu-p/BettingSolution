const { color } = require("../Interface/FieldType");
const UserRoles = require("../Interface/UserRoles");

const reportConfiguration = (currentUser) => {

    let todayDate = (new Date());
    let tomorrowDate = (new Date());
    todayDate.setHours(0, 0, 0);
    tomorrowDate.setHours(0, 0, 0);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return {
        "report1": {
            title: "Row Material Price info",
            chartType: "horizontal-bar",
            viewRole: [UserRoles.Admin],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: [
                {
                    field: "item_id",
                    label: "inventoryItem.name",
                    check_method: "simple"
                }
            ]
        },
        "accounts_status": {
            title: "Ledger Accounts Status",
            chartType: "bar",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "account",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "balance",
                    name: "Balance",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: [
                {
                    field: "type",
                    label: "type",
                    check_method: "simple"
                }
            ],
            visibleFields: ["account_number", "type", "balance"]
        },
        "customer_buying_frequency": {
            title: "Buying Frequency",
            chartType: "horizontal-bar",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "sell",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "count",
                    field: "remaining_price",
                    name: "Times Bought",
                    color: "blue"
                },
                // {
                //     agg: "sum",
                //     field: "remaining_price",
                //     name: "Times Bought",
                //     color: "blue"
                // }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "customer_id",
                    label: "sellCustomer.name",
                    check_method: "simple"
                }
            ]
        },
        "product_buying_frequency": {
            title: "Products Buying Frequency",
            chartType: "horizontal-bar",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "sell_product",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "count",
                    field: "product_id",
                    name: "Times Bought",
                    color: "blue"
                },
                {
                    agg: "sum",
                    field: "quantity",
                    name: "Quantity Bought",
                    color: "green"
                },
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "product_id",
                    label: "sellProduct.name",
                    check_method: "simple"
                }
            ]
        },
        "today_transaction": {
            title: "Today Transactions",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            condition: {
                AND: [
                    {created_on: {gt: todayDate.toISOString()}},
                    {created_on: {lt: tomorrowDate.toISOString()}}
                ]
            },
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["trx_number", 'sell_id', "amount"]
        },
        "sells_transaction": {
            title: "Sells Transactions",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "sell.sold_date",
                    label: "Sold Date",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["trx_number", 'category', "type", "amount", "created_on"]
        },
        "today_sells_transaction": {
            title: "ከ ሽያጭ የተሰበሰበ ብር",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                // {
                //     field: "sell.sold_date",
                //     label: "Sold Date",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["trx_number", "sell_id", "amount"]
        },
        "payment_collected_from_previous_sell": {
            title: "ከ ቀድሞ ዱቤ ሽያጭ ዛሬ ይተሰበሰበ ብር",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "sell.sold_date",
                    label: "sell.sold_date",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["trx_number", "sell_id", "amount"]
        },
        "payment_collected_sell_report": {
            title: "የተሰበሰበ ዱቤ ሽያጭ ብር",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "sell.sold_date",
                    label: "sell.sold_date",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["trx_number", "sell_id", "amount"]
        },
        "uncollected_sells": {
            title: "Uncollected Sells",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            tableName: "sell",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "remaining_price",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "sold_date",
                    label: "sold_date",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["sell_number", "remaining_price", "paid_price"]
        },
        "received_transfers": {
            title: "Received Sell Orders",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells, UserRoles.Finance],
            tableName: "transfer_product",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "transfer_id",
                    label: "Transfer.transfer_number",
                    check_method: "simple"
                }
            ],
            visibleFields: ["transfer_id", "product_id", "quantity", "total_price"]
        },
        "sells_transaction_history": {
            title: "Sells Payment Collection Performance",
            chartType: "bar",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "transaction",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "created_on",
                    label: "created_on",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["trx_number", 'category', "type", "amount", "created_on"]
        },
        "sells_count_history": {
            title: "Sell Count Performance",
            chartType: "bar",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "sell",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "count",
                    field: "amount",
                    name: "Amount",
                    color: "blue"
                }
            ],
            includeReferences: false,
            groupings: [
                {
                    field: "created_on",
                    label: "created_on",
                    check_method: "date_month_year"
                }
            ],
            visibleFields: ["trx_number", 'category', "type", "amount", "created_on"]
        },
        "overdue_services": {
            title: "Payment Date overdue Services",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "service",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "sum",
                //     field: "amount",
                //     name: "Amount"
                // }
            ],
            condition: {next_payment_date: {lt: todayDate.toISOString()}},
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["name", 'next_payment_date', "customer_id"]
        },
        "unpaid_purchases": {
            title: "Remaining Purchase Payments",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "purchase",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "remained_amount",
                    name: "Remained Amount",
                    color: "blue"
                }
            ],
            condition: {remained_amount: {gt: 0}},
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["purchase_number", 'paid_amount', "remained_amount"]
        },
        "report5": {
            title: "Products Price info",
            chartType: "pie",
            viewRole: [UserRoles.Admin],
            tableName: "store_product",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: [
                {
                    field: "product_id",
                    label: "ItemProduct.name",
                    check_method: "simple"
                }
            ]
        },
        "report2": {
            title: "Materials Balance by store",
            chartType: "doughnut",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: [
                {
                    field: "store_id",
                    label: "inStore.name",
                    check_method: "simple"
                }
            ]
        },
        "products_by_store": {
            title: "Products Balance by store",
            chartType: "doughnut",
            viewRole: [UserRoles.Admin, UserRoles.Finance],
            tableName: "store_product",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: [
                {
                    field: "store_id",
                    label: "ProductStore.name",
                    check_method: "simple"
                }
            ]
        },
        "report3": {
            title: "Score Report",
            chartType: "score",
            viewRole: [UserRoles.Admin],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "count",
                    field: "total_price",
                    name: "Total Price",
                    color: "blue"
                }
            ],
            condition: {},
            includeReferences: false,
            groupings: []
        },
        "report4": {
            title: "Production State",
            chartType: "doughnut",
            viewRole: [UserRoles.Admin],
            tableName: "production",
            legendColor: "red",
            calculationMethods: [
                {
                    agg: "sum",
                    field: "total_consumed_price",
                    name: "Consumed Price",
                    color: "blue"
                },
                {
                    agg: "sum",
                    field: "total_produced_price",
                    name: "Consumed Price",
                    color: "#32CD32"
                }
            ],
            condition: {
                // status: {not: "production_confirmed"}
            },
            includeReferences: false,
            groupings: [
                {
                    field: "status",
                    label: "status",
                    check_method: "simple"
                }
            ]
        },
        "store_products_list": {
            title: "Products On Hand",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells],
            tableName: "store_product",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "count",
                //     field: "total_consumed_price",
                //     name: "Consumed Price"
                // },
                {
                    agg: "sum",
                    field: "quantity",
                    name: "Available Quantity"
                }
            ],
            includeReferences: false,
            groupings: [
                // {
                //     field: "product_id",
                //     label: "ItemProduct.name",
                //     check_method: "simple"
                // }
            ],
            visibleFields: ["product_id", 'quantity']
        },
        "store_products": {
            title: "Products In store",
            chartType: "horizontal-bar",
            viewRole: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells],
            tableName: "store_product",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "count",
                //     field: "total_consumed_price",
                //     name: "Consumed Price"
                // },
                {
                    agg: "sum",
                    field: "quantity",
                    name: "Available Quantity"
                }
            ],
            condition: {
                // status: {not: "production_confirmed"}
            },
            includeReferences: false,
            groupings: [
                {
                    field: "product_id",
                    label: "ItemProduct.name",
                    check_method: "simple"
                }
            ]
        },
        "materials_in_store": {
            title: "Row Materials In store",
            chartType: "horizontal-bar",
            viewRole: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Sells],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "count",
                //     field: "total_consumed_price",
                //     name: "Consumed Price"
                // },
                {
                    agg: "sum",
                    field: "quantity",
                    name: "Available Quantity"
                }
            ],
            condition: {
                inventoryItem: {
                    type: "raw_material"
                }
            },
            includeReferences: true,
            groupings: [
                {
                    field: "item_id",
                    label: "inventoryItem.name",
                    check_method: "simple"
                }
            ]
        },
        "materials_in_store_list": {
            title: "Row Materials on Hand",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.Sells],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "count",
                //     field: "total_consumed_price",
                //     name: "Consumed Price"
                // },
                {
                    agg: "sum",
                    field: "quantity",
                    name: "Available Quantity"
                }
            ],
            condition: {
                inventoryItem: {
                    type: "raw_material"
                }
            },
            includeReferences: true,
            groupings: [
                // {
                //     field: "item_id",
                //     label: "inventoryItem.name",
                //     check_method: "simple"
                // }
            ],
            visibleFields: ["item_id", 'quantity']
        },
        "waiting_production": {
            title: "Productions Waiting Approval",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.BranchManager],
            tableName: "production",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "sum",
                //     field: "remained_amount",
                //     name: "Remained Amount"
                // }
            ],
            condition: {
                OR: [
                    {status: "waiting_production_approval"},
                    {status: "waiting_consumption_approval"},
                ]
            },
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["prod_number", 'status', "managed_by"]
        },
        "waiting_purchases": {
            title: "Purchases Waiting for Approval",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.BranchManager],
            tableName: "purchase",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "sum",
                //     field: "remained_amount",
                //     name: "Remained Amount"
                // }
            ],
            condition: {status: "waiting_approval"},
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["purchase_number", 'status', "store_id"]
        },
        "items_below_level": {
            title: "Items Reached Minimum Quantity",
            chartType: "list",
            viewRole: [UserRoles.Admin, UserRoles.BranchManager],
            tableName: "store_item",
            legendColor: "red",
            calculationMethods: [
                // {
                //     agg: "sum",
                //     field: "remained_amount",
                //     name: "Remained Amount"
                // }
            ],
            condition: {level_state: {in: ["below", "leveled"]}},
            includeReferences: false,
            groupings: [
                // {
                //     field: "created_on",
                //     label: "created_on",
                //     check_method: "date_month_year"
                // }
            ],
            visibleFields: ["item_id", 'level_state', "store_id", "quantity"]
        },
    };
}

module.exports = reportConfiguration;