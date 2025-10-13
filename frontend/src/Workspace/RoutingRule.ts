const RoutingRule = (workspaceId: string, navigationData: any) => {

    console.log("routing rule -----------------", workspaceId, navigationData);
    if(workspaceId == "operation_management") {

        if(navigationData.type == "form" && navigationData.table == "production") {
            return {
                id: `/production-form/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "production",
                rec_id: navigationData.rec_id,
                dashboard_id: "production-form",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else if(navigationData.type == "form" && navigationData.table == "sell") {
            return {
                id: `/create-sell/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "sell",
                rec_id: navigationData.rec_id,
                dashboard_id: "create-sell",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else if(navigationData.type == "form" && navigationData.table == "purchase") {
            return {
                id: `/create-purchase/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "purchase",
                rec_id: navigationData.rec_id,
                dashboard_id: "create-purchase",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else if(navigationData.type == "form" && navigationData.table == "receive_product") {
            return {
                id: `/receive-slip/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "receive_product",
                rec_id: navigationData.rec_id,
                dashboard_id: "receive-slip",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else if(navigationData.type == "form" && navigationData.table == "transfer") {
            return {
                id: `/transfer-form/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "transfer-form",
                rec_id: navigationData.rec_id,
                dashboard_id: "transfer-form",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else if(navigationData.type == "form" && navigationData.table == "issue_ticket") {
            return {
                id: `/issue-form/${navigationData.rec_id ?? "-1"}`,
                title: "Loading...",
                type: "page",
                table: "issue-form",
                rec_id: navigationData.rec_id,
                dashboard_id: "issue-form",
                data: {
                    routeData: {
                        params: {
                            id: navigationData.rec_id
                        }
                    },
                    dataPassed: {}
                }
            };
        } else {
            return navigationData;
        }
    } else {
        return navigationData;
    }
};

export default RoutingRule;