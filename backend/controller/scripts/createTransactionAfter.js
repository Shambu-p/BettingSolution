const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const TransactionCategory = require('../../Interface/TransactionCategory');
const transactionScripts = require('../relatedScript/transaction');
const TransactionType = require('../../Interface/TransactionType');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');

async function createTransactionAfter(reqUser, data, dependencies, smsService) {

    if(data.category == TransactionCategory.sell) {

        await transactionScripts.sell(data, dependencies);

        if(data.type == TransactionType.debit) {

            let related_transaction = await dependencies.databasePrisma.transaction.findMany({
                where: {
                    sell_id: data.sell_id,
                    category: TransactionCategory.sell
                }
            });
    
            let debit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit && trx.sys_id != data.sys_id)).reduce((acc, trx) => (acc + trx.amount), 0);
            let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);

            if((credit_trx_amount - (debit_trx_amount + data.amount)) >= 0.01 ) {
                await DefaultController.update(
                    SystemUser,
                    "sell",
                    {
                        ...data.sell,
                        paid_price: (data.sell.paid_price + data.amount),
                        remaining_price: (data.sell.remaining_price - data.amount)
                    },
                    dependencies,
                    smsService
                );
            } else {
                await DefaultController.update(
                    SystemUser,
                    "sell",
                    {
                        ...data.sell,
                        status: "paid",
                        paid_price: (data.sell.paid_price + data.amount),
                        remaining_price: (data.sell.remaining_price - data.amount)
                    },
                    dependencies,
                    smsService
                );
            }

        }

    } else if(data.category == TransactionCategory.purchase) {

        if(data.type == TransactionType.credit) {

            let purchase_record = await dependencies.databasePrisma.purchase.findFirst({
                where: {
                    sys_id: data.purchase_id
                }
            });
    
            if(!purchase_record) {
                throw dependencies.exceptionHandling.throwError("The purchase Associated with the current transaction not found!", 500);
            }
    
            await transactionScripts.purchase(data, purchase_record.tax_amount, dependencies);

        } else {
            await transactionScripts.purchase(data, 0, dependencies);
        }

        if(data.type == TransactionType.debit) {

            let related_transaction = await dependencies.databasePrisma.transaction.findMany({
                where: {
                    purchase_id: data.purchase_id,
                    category: TransactionCategory.purchase
                }
            });
    
            let debit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit && trx.sys_id != data.sys_id)).reduce((acc, trx) => (acc + trx.amount), 0);
            let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);

            let new_data;

            if((debit_trx_amount + data.amount) < credit_trx_amount) {

                new_data = {
                    ...data.purchase,
                    paid_amount: (data.purchase.paid_amount + data.amount),
                    remained_amount: (data.purchase.remained_amount - data.amount)
                };

            } else {

                new_data = {
                    ...data.purchase,
                    status: "paid",
                    paid_amount: (data.purchase.paid_amount + data.amount),
                    remained_amount: (data.purchase.remained_amount - data.amount)
                };
                
            }

            await DefaultController.update(
                SystemUser,
                "purchase",
                new_data,
                dependencies,
                smsService
            );

        }

    } else if(data.category == TransactionCategory.production) {
        await transactionScripts.production(data, dependencies);
    } else if(data.category == TransactionCategory.serviceFee) {
        await transactionScripts.serviceFee(data, dependencies);
    } else if(data.category == TransactionCategory.tax) {
        await transactionScripts.taxFee(data, dependencies);
    } else if(data.category == TransactionCategory.paidTax) {
        await transactionScripts.paidTax(data, dependencies);
    } else if(data.category == TransactionCategory.shareCapital) {
        await transactionScripts.shareCapital(data, dependencies);
    } else if(data.category == TransactionCategory.devidend) {
        await transactionScripts.devidend(data, dependencies);
    } else if(data.category == TransactionCategory.otherExpence) {
        await transactionScripts.otherExpence(data, dependencies);
    } else if(data.category == TransactionCategory.otherIncom) {
        await transactionScripts.otherIncome(data, dependencies);
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createTransactionAfter;