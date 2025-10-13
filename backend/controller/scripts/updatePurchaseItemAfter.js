const { v4: uuidv4 } = require('uuid');

async function updatePurchaseItemAfter(reqUser, data, changes, dependencies, smsService) {


    let found_purchase = await dependencies.databasePrisma.purchase.findFirst({
        where: {
            sys_id: data.purchase_id
        }
    });
    
    if(!found_purchase) {
        throw new Error("purchase not found!");
    }

    if(found_purchase.status != "draft"){
        throw new Error("you can only update items under draft purchases!");
    }

    let found_purchase_items = await dependencies.databasePrisma.purchase_item.findMany({
        where: {
            purchase_id: data.purchase_id
        }
    });

    // let purchase_total_price = found_purchase_items.filter(pi => (pi.sys_id != data.sys_id)).reduce((acc, currentItem) => (acc + (currentItem.quantity * currentItem.unit_price)), 0);
    // purchase_total_price += (data.quantity * data.unit_price);

    // update tax amount and total price of the purchase
    let purchase_items = found_purchase_items.filter(pi => (pi.sys_id != data.sys_id));
    let purchase_total_price = purchase_items.reduce((acc, currentItem) => (acc + currentItem.total_price), 0);
    let purchase_total_tax_price = purchase_items.reduce((acc, currentItem) => (acc + currentItem.tax_amount), 0);
    purchase_total_price += (data.total_price);
    purchase_total_tax_price += (data.tax_amount);

    await dependencies.databasePrisma.purchase.update({
        data: {
            ...found_purchase,
            total_price: purchase_total_price,
            tax_amount: purchase_total_tax_price
        },
        where: {
            sys_id: found_purchase.sys_id
        }
    });

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updatePurchaseItemAfter;