const { v4: uuidv4 } = require('uuid');

async function createStoreProductBefore(reqUser, data, dependencies, smsService) {

    let found_item = await dependencies.databasePrisma.product.findFirst({
        where: {
            sys_id: data.product_id
        }
    });

    if(!found_item) {
        throw new Error("inventory item not found!");
    }

    if(data.quantity > found_item.minimum_level) {
        data.level_state = "normal"
    } else if(data.quantity < found_item.minimum_level) {
        data.level_state = "below"
    } else {
        data.level_state = "leveled"
    }

    data.total_price = (data.quantity * found_item.unit_price);
    // data.refering_text = uuidv4();

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createStoreProductBefore;