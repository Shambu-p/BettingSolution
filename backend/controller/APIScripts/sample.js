
module.export = (req, dependencies, notification) => {

    dependencies.emitJsonData("notification", data.to_user, {
        // sys_id: data.sys_id,
        // type: data.type,
        // read: data.read,
        // description: data.description,
        // method: data.method,
        // to_user: data.to_user
    });

}