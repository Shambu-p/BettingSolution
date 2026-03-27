

module.exports = async function (req, dependencies, notification, DefaultController) {

    //console.log("working-------------------------------------------------");

    let trxData = await dependencies.databasePrisma.charger_trx.findFirst({
        where: {
            sys_id: req.body.trx_id
        }
    });

    if(!trxData) {
        throw dependencies.exceptionHandling.throwError("transaction not found", 500);
    }

    

    await DefaultController.update(
        req.systemUser,
        "charger_trx",
        {
            sys_id: trxData.sys_id,
            legacy_id: trxData.legacy_id,
            id_token: trxData.id_token,
            // user_id: trxData.user_id,
            // card_id: trxData.card_id,
            // branch_id: trxData.branch_id,
            // connector_id: trxData.connector_id,
            status: req.body.status,
            charge_amount: req.body.meter_value,
            // rate: trxData.rate,
            total_payment: 0,
            fee_collected: 0
            // started_on: trxData.started_on,
            // ended_on: trxData.ended_on
        },
        dependencies,
        notification
    );

    return req.body;

}