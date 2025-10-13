const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');

async function createTransactionBefore(reqUser, data, dependencies, smsService) {

    let found_auto_number = await dependencies.databasePrisma.auto_number.findFirst({
        where: {
            name: "transaction_number"
        }
    });

    if(!found_auto_number) {
        throw dependencies.exceptionHandling.throwError("auto number for transaction not found!", 500);
    }

    data.trx_number = `${found_auto_number.prefix ?? ""}${found_auto_number.current_number}${found_auto_number.sufix ?? ""}`;
    data.status = true;

    if(data.category == TransactionCategory.purchase) {

        let found_purchase = await dependencies.databasePrisma.purchase.findFirst({
            where: {
                sys_id: data.purchase_id,
            }
        });

        if(!found_purchase) {
            throw dependencies.exceptionHandling.throwError("purchase not found!", 500);
        }

        let related_transaction = await dependencies.databasePrisma.transaction.findMany({
            where: {
                purchase_id: data.purchase_id,
                category: TransactionCategory.purchase
            }
        });

        if(data.type == TransactionType.credit && (related_transaction.filter(trx => trx.type == TransactionType.credit).length > 0)) {
            throw dependencies.exceptionHandling.throwError("transaction for the purchase already recorded! make sure you select the right purchase", 500);
        }

        let total_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit)).reduce((acc, trx) => (acc + trx.amount), 0);

        // console.log("total trx amount ", total_trx_amount, found_purchase, data, ((found_purchase.total_price - total_trx_amount) < data.amount));
        if(total_trx_amount >= found_purchase.total_price || ((found_purchase.total_price - total_trx_amount) < data.amount)) {
            throw dependencies.exceptionHandling.throwError(`credit and debit does not balance total amount is ${found_purchase.total_price} and already ${total_trx_amount} is paid`, 500);
        }

    } else if(data.category == TransactionCategory.sell) {

        let related_transaction = await dependencies.databasePrisma.transaction.findMany({
            where: {
                sell_id: data.sell_id,
                category: TransactionCategory.sell
            }
        });

        if(data.type == TransactionType.credit) {
            if(related_transaction.filter(trx => trx.type == TransactionType.credit).length > 0) {
                throw dependencies.exceptionHandling.throwError("transaction for the sell already recorded! make sure you select the right sell", 500);
            }
        }else {

            let total_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit)).reduce((acc, trx) => (acc + trx.amount), 0);
            let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);
    
            if(total_trx_amount >= credit_trx_amount || ((credit_trx_amount - total_trx_amount) < data.amount)) {
                throw dependencies.exceptionHandling.throwError(`credit and debit does not balance total amount is ${credit_trx_amount} and already ${total_trx_amount} is paid`, 500);
            }

        }

    } else if(data.category == TransactionCategory.production) {

        let related_transaction = await dependencies.databasePrisma.transaction.findMany({
            where: {
                production_id: data.production_id,
            }
        });

        if(data.type == TransactionType.credit) {
            if(related_transaction.filter(trx => trx.type == TransactionType.credit).length > 0) {
                throw dependencies.exceptionHandling.throwError("transaction for the production already recorded! make sure you select the right production", 500);
            }
        }
        // else {

        //     let total_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit)).reduce((acc, trx) => (acc + trx.amount), 0);
        //     let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);
    
        //     if(credit_trx_amount <= total_trx_amount && ((total_trx_amount - credit_trx_amount) < data.amount)) {
        //         throw dependencies.exceptionHandling.throwError(`credit and debit does not balance total amount is ${credit_trx_amount} and already ${total_trx_amount} is paid`, 500);
        //     }

        // }


    } else if(data.category == TransactionCategory.serviceFee) {

        if(data.type == TransactionType.debit) {

            let related_transaction = await dependencies.databasePrisma.transaction.findMany({
                where: {
                    service_id: data.service_id,
                }
            });
    
            let total_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit)).reduce((acc, trx) => (acc + trx.amount), 0);
            let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);
    
            if(total_trx_amount <= credit_trx_amount && ((credit_trx_amount - total_trx_amount) < data.amount)) {
                throw dependencies.exceptionHandling.throwError(`credit and debit does not balance! total amount is ${credit_trx_amount}ETB and already ${total_trx_amount}ETB is paid, the total due is ${credit_trx_amount - total_trx_amount}ETB`, 500);
            }

        }
    } else if(data.category == TransactionCategory.tax) {

        if(data.type == TransactionType.debit) {

            let related_transaction = await dependencies.databasePrisma.transaction.findMany({
                where: {
                    category: TransactionCategory.tax,
                }
            });

            let total_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.debit)).reduce((acc, trx) => (acc + trx.amount), 0);
            let credit_trx_amount = related_transaction.filter(trx => (trx.type == TransactionType.credit)).reduce((acc, trx) => (acc + trx.amount), 0);
    
            if(total_trx_amount <= credit_trx_amount && ((credit_trx_amount - total_trx_amount) < data.amount)) {
                throw dependencies.exceptionHandling.throwError(`credit and debit does not balance! total amount is ${credit_trx_amount}ETB and already ${total_trx_amount}ETB is paid, the total due is ${credit_trx_amount - total_trx_amount}ETB`, 500);
            }

        } else {

            if(!data.sell_id || data.sell_id == "") {
                throw dependencies.exceptionHandling.throwError(`Tax transactions should be related to sell records`, 500);
            }

        }
    } else if(data.category == TransactionCategory.paidTax) {

        if(data.type == TransactionType.credit) {
            throw dependencies.exceptionHandling.throwError(`Paid Tax Cannot be credited! If you want to record tax fee that will be paid in the feature please create tax fee transaction.`, 500);
        }
        // else {

        //     if(!data.purchase_id || data.purchase_id == "") {
        //         throw dependencies.exceptionHandling.throwError(`Paid Tax transactions should be related to purchase record! If you want to pay tax payable please create tax fee transaction with debit type!`, 500);
        //     }

        // }

    } else if(data.category == TransactionCategory.shareCapital) {

        if(data.type == TransactionType.debit) {
            throw dependencies.exceptionHandling.throwError(`cannot debit share capital account! please record devidend instead.`, 500);
        }

    } else if(data.category == TransactionCategory.devidend) {

        if(data.type == TransactionType.credit) {

            let accounts = await dependencies.databasePrisma.account.findMany({
                where: {
                    OR: [
                        {type: "revenue"},
                        {type: "expence"}
                    ]
                }
            });

            let revenue_amount = accounts.filter(trx => (trx.type == "revenue")).reduce((acc, trx) => (acc + trx.balance), 0);
            let expence_amount = accounts.filter(trx => (trx.type == "expence")).reduce((acc, trx) => (acc + trx.balance), 0);
            
            if((revenue_amount - expence_amount) < data.amount) {
                throw dependencies.exceptionHandling.throwError(`this transaction will result the organization in unbalanced state! here is your revenue before tax ${(revenue_amount - expence_amount)}`, 500);
            }

        }

    } else if(data.category == TransactionCategory.otherIncom) {

        if(data.type == TransactionType.debit) {
            throw dependencies.exceptionHandling.throwError(`Transaction category and type miss match! debit transaction on revenue account are not allowed!`, 500);
        } else {
            if(!data.remark || data.remark == "") {
                throw dependencies.exceptionHandling.throwError(`remark is necessary!`, 500);
            }
        }

    } else if(data.category == TransactionCategory.otherExpence) {

        if(data.type == TransactionType.credit) {
            throw dependencies.exceptionHandling.throwError(`Transaction category and type miss match! credit transactions on expense account are not allowed `, 500);
        } else {
            if(!data.remark || data.remark == "") {
                throw dependencies.exceptionHandling.throwError(`remark is necessary!`, 500);
            }
        }

    } else {
        throw dependencies.exceptionHandling.throwError("transaction category not found!", 500);
    }

    await dependencies.databasePrisma.auto_number.update({
        data: {
            current_number: Utils.incrementStringNumber(found_auto_number.current_number)
        },
        where: {
            name: "transaction_number"
        }
    });

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createTransactionBefore;