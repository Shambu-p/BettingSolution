const TransactionCategory = require("../../Interface/TransactionCategory");
const TransactionType = require("../../Interface/TransactionType");

const accountNumbers = {
    assets: "ACC0001",
    payable: "ACC0002",
    receivable: "ACC0003",
    revenue: "ACC0004",
    expence: "ACC0005",
    share_capital: "ACC0006",
    share_withdrawal: "ACC0007",
    tax_payable: "ACC0008",
    tax_paid: "ACC0013"
};

async function getAccountDetails(dependencies) {

    let allAccounts = {};

    let accounts = await dependencies.databasePrisma.account.findMany({});

    Object.keys(accountNumbers).forEach((prop) => {
        allAccounts[prop] = accounts.find((acc) => (acc.account_number == accountNumbers[prop]));
    });

    return allAccounts;

};

const transactionScripts = {

    

    sell: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.receivable) {
            throw dependencies.exceptionHandling.throwError("Receivable ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

        } else {

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Revenue ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });
        }
        
    },
    sellReverse: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.receivable) {
            throw dependencies.exceptionHandling.throwError("Receivable ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

        } else {

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Revenue ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });
        }

    },

    devidend: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.share_withdrawal) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Revenue ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.share_withdrawal.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.share_withdrawal.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });

        }

    },
    devidendReverse: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.share_withdrawal) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Revenue ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.share_withdrawal.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.share_withdrawal.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });

        }

    },
    shareCapital: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {
            
            if(!allAccounts.share_capital) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.share_capital.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.share_capital.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },
    shareCapitalReverse: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {
            
            if(!allAccounts.share_capital) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.share_capital.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.share_capital.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },
    purchase: async (transaction, tax_paid, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.payable) {
            throw dependencies.exceptionHandling.throwError("Payable ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + (transaction.amount - tax_paid))},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });

        } else {

            if(!allAccounts.expence) {
                throw dependencies.exceptionHandling.throwError("Expence ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.expence.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.expence.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });
        }

    },
    purchaseReverse: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.payable) {
            throw dependencies.exceptionHandling.throwError("Payable ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });

        } else {

            if(!allAccounts.expence) {
                throw dependencies.exceptionHandling.throwError("Expense ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.expence.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.expence.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });
        }

    },
    serviceFee: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.payable) {
            throw dependencies.exceptionHandling.throwError("Payable ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.credit) {

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });

        } else {

            if(!allAccounts.expence) {
                throw dependencies.exceptionHandling.throwError("Expence ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.expence.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.expence.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.payable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.payable.sys_id
                }
            });
        }

    },
    serviceFeeReverse: (transaction, dependencies) => {

    },
    production: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.receivable) {
            throw dependencies.exceptionHandling.throwError("Receivable ledger account not found!", 500);
        }
        
        if(!allAccounts.assets) {
            throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
        }
    
        if(transaction.type == TransactionType.credit) {

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

        } else {

            let consumptions = await dependencies.databasePrisma.production_consumption.findMany({
                where: {
                    production_id: transaction.production_id
                }
            });

            let consumption_amount = consumptions.reduce((acc, cnspn) => (acc + cnspn.total_price), 0);

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance - consumption_amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });
        }

    },
    productionReverese: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);

        if(!allAccounts.receivable) {
            throw dependencies.exceptionHandling.throwError("Receivable ledger account not found!", 500);
        }
        
        if(!allAccounts.assets) {
            throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
        }
    
        if(transaction.type == TransactionType.credit) {

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

        } else {

            let consumptions = await dependencies.databasePrisma.production_consumption.findMany({
                where: {
                    production_id: transaction.production_id
                }
            });

            let consumption_amount = consumptions.reduce((acc, cnspn) => (acc + cnspn.total_price), 0);

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.receivable.balance + consumption_amount)},
                where: {
                    sys_id: allAccounts.receivable.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });
        }

    },
    otherIncome: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },

    taxFee: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        
        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.tax_payable) {
                throw dependencies.exceptionHandling.throwError("Tax Payable ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.tax_payable.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.tax_payable.sys_id
                }
            });

        } else if(transaction.type == TransactionType.debit) {

            if(!allAccounts.tax_paid) {
                throw dependencies.exceptionHandling.throwError("Paid Tax ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.tax_paid.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.tax_paid.sys_id
                }
            });

        }

    },

    paidTax: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(!allAccounts.tax_paid) {
            throw dependencies.exceptionHandling.throwError("Paid Tax ledger account not found!", 500);
        }

        if(transaction.type == TransactionType.debit) {

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.tax_paid.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.tax_paid.sys_id
                }
            });

        }

    },

    reverseOtherIncome: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.credit) {

            if(!allAccounts.revenue) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.revenue.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.revenue.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },

    otherExpence: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.debit) {
            
            if(!allAccounts.expence) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.expence.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.expence.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },

    reverseOtherExpence: async (transaction, dependencies) => {

        let allAccounts = await getAccountDetails(dependencies);
        
        if(transaction.type == TransactionType.debit) {
            
            if(!allAccounts.expence) {
                throw dependencies.exceptionHandling.throwError("Share Capital ledger account not found!", 500);
            }
            if(!allAccounts.assets) {
                throw dependencies.exceptionHandling.throwError("Asset ledger account not found!", 500);
            }

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.expence.balance - transaction.amount)},
                where: {
                    sys_id: allAccounts.expence.sys_id
                }
            });

            await dependencies.databasePrisma.account.update({
                data: {balance: (allAccounts.assets.balance + transaction.amount)},
                where: {
                    sys_id: allAccounts.assets.sys_id
                }
            });

        }

    },

}


module.exports = transactionScripts;