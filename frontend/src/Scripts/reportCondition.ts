import { Category } from "@mui/icons-material";

const reportCondition: any = {
    report1: (inputs: any) => {
        return {};
    },
    report5: (inputs: any) => {
        return {};
    },
    report2: (inputs: any) => {
        return {};
    },
    report3: (inputs: any) => {
        return {};
    },
    report4: (inputs: any) => {
        return {};
    },
    store_products: (inputs: any) => {
        return {};
    },
    store_products_list: (inputs: any) => {
        return {
            quantity: {gt: 0}
        };
    },
    accounts_status: (inputs: any) => {
        return {};
    },
    products_by_store: (inputs: any) => {
        return {};
    },
    today_transaction: (inputs: any) => {
        return {
            AND: [
                {created_on: {gt: inputs.todayDate}},
                {created_on: {lt: inputs.tomorrowDate}}
            ]
        };
    },
    sells_transaction: (inputs: any) => {
        return {
            AND: [
                {created_on: {gte: inputs.todayDate}},
                {created_on: {lt: inputs.tomorrowDate}},
                {created_by: inputs.creator},
                {category: "sell"},
                {type: "debit"},
            ]
        };
    },
    today_sells_transaction: (inputs: any) => {
        return {
            AND: [
                {created_on: {gte: inputs.todayDate}},
                {created_on: {lt: inputs.tomorrowDate}},
                { sell: {sold_date: {lt: inputs.tomorrowDate}}},
                { sell: {sold_date: {gte: inputs.todayDate}}},
                {created_by: inputs.creator},
                {category: "sell"},
                {type: "debit"},
            ]
        };
    },
    payment_collected_from_previous_sell: (inputs: any) => {
        return {
            AND: [
                {
                    created_on: {gte: inputs.todayDate},
                    sell: {
                        sold_date: {lt: inputs.todayDate},
                    },
                    created_by: inputs.creator,
                    category: "sell",
                    type: "debit"
                },
            ]
        };
    },
    payment_collected_sell_report: (inputs: any) => {
        return {
            AND: [
                {created_on: {lt: inputs.tomorrowDate}},
                {
                    created_on: {gte: inputs.todayDate},
                    sell: {
                        sold_date: {lt: inputs.todayDate}
                    },
                    created_by: inputs.creator,
                    category: "sell",
                    type: "debit"
                },
            ]
        };
    },
    uncollected_sells: (inputs: any) => {
        return {
            AND: [
                {
                    sold_date: {gte: inputs.todayDate},
                    created_by: inputs.creator,
                    status: "sold",
                    remaining_price: {gt: 0}
                },
                { sold_date: {lt: inputs.tomorrowDate} }
            ]
        };
    },
    received_transfers: (inputs: any) => {
        return {
            AND: [
                {
                    Transfer: {
                        accepted_by: inputs.creator,
                        finished_on: {gte: inputs.todayDate},
                        status: "received"
                    }
                },
                {
                    Transfer: {
                        finished_on: {lt: inputs.tomorrowDate}
                    }
                }
            ]
        };
    },
    customer_buying_frequency: (inputs: any) => {
        return {
            AND: [
                {sold_date: {gte: inputs.fromDate}},
                {sold_date: {lt: inputs.toDate}},
                {status: {not: "draft"}},
                {status: {not: "cancelled"}},
            ]
        };
    },
    product_buying_frequency: (inputs: any) => {
        return {
            Sell: {
                AND: [
                    {sold_date: {gte: inputs.fromDate}},
                    {sold_date: {lt: inputs.toDate}},
                    {status: {not: "draft"}},
                    {status: {not: "cancelled"}},
                ]
            }
        };
    },
    sells_transaction_history: (inputs: any) => {
        return {
            AND: [
                {created_on: {gte: inputs.todayDate}},
                {created_on: {lt: inputs.tomorrowDate}},
                {created_by: inputs.creator},
                {category: "sell"},
                {type: "debit"},
            ]
        };
    },
    sells_count_history: (inputs: any) => {
        return {
            AND: [
                {created_on: {gte: inputs.todayDate}},
                {created_on: {lt: inputs.tomorrowDate}},
                {created_by: inputs.creator},
                {status: {not: "cancelled"}},
                {status: {not: "darft"}},
            ]
        };
    },
    overdue_services: (inputs: any) => {
        return {next_payment_date: {lt: inputs.todayDate}};
    },
    unpaid_purchases: (inputs: any) => {
        return {remained_amount: {gt: 0}};
    },
    materials_in_store: (inputs: any) => {
        return {
            inventoryItem: {
                type: "raw_material"
            },
            quantity: {gt: 0}
        };
    },
    materials_in_store_list: (inputs: any) => {
        return {
            inventoryItem: {
                type: "raw_material"
            }
        };
    },
    waiting_production: (inputs: any) => {
        return {
            OR: [
                {status: "waiting_production_approval"},
                {status: "waiting_consumption_approval"},
            ]
        };
    },
    items_below_level: (inputs: any) => {
        return {level_state: {in: ["below", "leveled"]}};
    },
    waiting_purchases: (inputs: any) => {
        return {status: "waiting_approval"};
    },
    
};

export default reportCondition;