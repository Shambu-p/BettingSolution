const { v4: uuidv4 } = require('uuid');
const DefaultController = require('../DefaultController');

async function createPurchaseItemBefore(reqUser, data, dependencies, smsService) {

    let found_item = await dependencies.databasePrisma.inventory_item.findFirst({
        where: {
            sys_id: data.item_id
        }
    });
    let found_items = await dependencies.databasePrisma.inventory_item.findMany({
        where: {
            item_number: found_item.item_number
        }
    });

    let matching_item = found_items.find(itm => (itm.unit_price == data.unit_price));

    if(!matching_item) {
        let new_item = await DefaultController.create(reqUser, "inventory_item", {
            ...found_item,
            name: `${found_item.name}-${data.unit_price}`,
            unit_price: data.unit_price,
            is_defination: false
        }, dependencies, smsService);

        data.item_id = new_item.sys_id;
    }

    if(!data.tax_percentage) {
        data.tax_percentage = 0;
    }

    data.before_tax = (data.quantity * data.unit_price);
    data.tax_amount = (data.before_tax * data.tax_percentage);
    data.total_price = (data.before_tax + data.tax_amount);

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createPurchaseItemBefore;