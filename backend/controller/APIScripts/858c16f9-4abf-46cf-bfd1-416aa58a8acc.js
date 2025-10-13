

module.export = async (req, dependencies, notification, DefaultController) => {

    let order = await DefaultController.create(req.systemUser, "order", {
        order_number: req.body.order_number,
        seller_id: req.systemUser.sys_id,
        user_id: req.systemUser.sys_id
    });

    let seller = await dependencies.databasePrisma.user.finFist({
        where: {
            sys_id: order.seller_id
        }
    });

    await notification.send(seller.phone, "you have received new order");
    // await notification.send(order_by.phone, "your order request was sent successfully!");

    return order;

}