// const { v4: uuidv4 } = require('uuid');
// const DefaultController = require('../DefaultController');
// const SystemUser = require('../auth/SystemUser');
const ComponentManager = require('../../infrastructure/UIManagement/ComponentManager');
const Utils = require('../../infrastructure/service/Utils');

async function updateUIComponentAfter(reqUser, data, changes, dependencies, smsService) {

    let is_usage_changed = changes.find(change => change.column == "usage");
    let is_route_params_changed = changes.find(change => change.column == "route_params");
    let is_ui_type_changed = changes.find(change => change.column == "ui_type");
    let is_name_changed = changes.find(change => change.column == "name");

    let found_components = await dependencies.databasePrisma.ui_component.findMany({
        where: {
            sys_id: { not: data.sys_id }
        },
        select: {
            sys_id: true,
            name: true,
            route_params: true,
            usage: true
        }
    });

    found_components.push({
        sys_id: data.sys_id,
        name: data.name,
        route_params: data.route_params,
        usage: data.usage
    });

    let uiManager = new ComponentManager("../frontend");
    uiManager.updateComponent(Utils.toPascalCase(data.name), data.component_script);

    if(is_usage_changed && is_route_params_changed && is_ui_type_changed) {
        let routeMapping = uiManager.buildRouteMapping(found_components);
        uiManager.updateRouteMapping(routeMapping.imports, routeMapping.desktop, routeMapping.mobile);
    }

    if(is_name_changed) {
        let componentRegistry = uiManager.buildComponentRegistry(found_components);
        uiManager.updateRegistry(componentRegistry.imports, componentRegistry.components);
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = updateUIComponentAfter;