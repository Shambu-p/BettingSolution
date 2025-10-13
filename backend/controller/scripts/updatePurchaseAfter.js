const { v4: uuidv4 } = require('uuid');
const UserRoles = require('../../Interface/UserRoles');
const Utils = require('../../infrastructure/service/Utils');
const DefaultController = require('../DefaultController');
const SystemUser = require('../auth/SystemUser');
const TransactionCategory = require('../../Interface/TransactionCategory');
const TransactionType = require('../../Interface/TransactionType');

async function updatePurchaseAfter(reqUser, data, changes, dependencies, smsService) {

    let is_status_changed = changes.find(change => change.column == "status");
    if(is_status_changed && data.status == "waiting_approval") {

        let found_store = await dependencies.databasePrisma.store.findFirst({
            where: {
                sys_id: data.store_id
            },
            include: {
                storeItems: true,
                managedBy: true
            }
        });

        await smsService.sendSMS(found_store.managedBy.phone, `New purchase ${data.purchase_number} approval is waiting for your response. please check and items when arrived and confirm.`);

    } else if(is_status_changed && data.status == "confirmed") {

        let found_store = await dependencies.databasePrisma.store.findFirst({
            where: {
                sys_id: data.store_id
            },
            include: {
                storeItems: true,
                managedBy: true
            }
        });

        if(!found_store) {
            throw new Error("store to be updated not found!");
        }

        let purchase_items = await dependencies.databasePrisma.purchase_item.findMany({
            where: {
                purchase_id: data.sys_id
            }
        });

        let found_purchase_items = [];
        let search_result;

        // unifying duplicated items by updating their quantity 
        for(let prod_item of purchase_items) {
            search_result = found_purchase_items.findIndex((value) => (prod_item.item_id == value.item_id));
            if(!search_result || search_result > -1) {
                found_purchase_items[search_result] = {
                    ...found_purchase_items[search_result],
                    quantity: (found_purchase_items[search_result].quantity + prod_item.quantity)
                }
            } else {
                found_purchase_items.push(prod_item);
            }
        }


        // updating store quantity by the new purchased items quantity if not found create the new item.
        let found_store_item;
        for(let purchase_item of found_purchase_items) {

            found_store_item = found_store.storeItems.find(sit => (sit.item_id == purchase_item.item_id));
            if(found_store_item) {
                found_store_item.quantity += purchase_item.quantity;
                await DefaultController.update(SystemUser, "store_item", found_store_item, dependencies, smsService);
            } else {
                await DefaultController.create(SystemUser, "store_item", {
                    item_id: purchase_item.item_id,
                    store_id: data.store_id,
                    quantity: purchase_item.quantity,
                    level_state: "normal"
                }, dependencies, smsService);
            }

        }

        // record transaction of purchase total amount
        await DefaultController.create(SystemUser, "transaction", {
            category: TransactionCategory.purchase,
            type: TransactionType.credit,
            status: true,
            amount: data.total_price,
            purchase_id: data.sys_id
        }, dependencies, smsService);

        // record transaction of tax paid when purchasing the items.
        if(data.tax_amount > 0) {
            await DefaultController.create(SystemUser, "transaction", {
                category: TransactionCategory.paidTax,
                type: TransactionType.debit,
                status: true,
                amount: data.tax_amount,
                purchase_id: data.sys_id
            }, dependencies, smsService);
        }

        // let admin_and  = await dependencies.databasePrisma.user.findFirst({
        //     where: {
        //         sys_id: data.created_by
        //     },
        //     include: {
        //         creater: true,
        //     }
        // });

        await smsService.sendSMS(data.creater.phone, `Your purchase request to ${found_store.name} store has been checked and accepted. Now you can start recording the receipts and payments!`);

    }

    return data;

}

module.exports = updatePurchaseAfter;