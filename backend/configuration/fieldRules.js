const accountDefination = require("./Forms/accountDefination");
const activityDefination = require("./Forms/activityDefination");
const attachmentDefination = require("./Forms/attachmentDefination");
const attachmentDocument = require("./Forms/attachmentDocument");
const autoNumberDefination = require("./Forms/autoNumberDefination");
const choiceDefination = require("./Forms/choiceDefination");
const customerDefination = require("./Forms/customerDefination");
const deliveryDefination = require("./Forms/deliveryDefination");
const finishedProductDefination = require("./Forms/finishedProductDefination");
const inventoryDefination = require("./Forms/InventoryDefination");
const productDefination = require("./Forms/productDefination");
const productionConsumptionDefination = require("./Forms/productionConsumptionDefination");
const productionDefination = require("./Forms/productionDefination");
const purchaseDefination = require("./Forms/purchaseDefination");
const purchaseItemDefination = require("./Forms/purchaseItemDefination");
const roleDefination = require("./Forms/roleDefination");
const sellDefination = require("./Forms/sellDefination");
const sellProductDefination = require("./Forms/sellProductDefination");
const serviceDefination = require("./Forms/serviceDefination");
const storeDefination = require("./Forms/storeDefination");
const storeItemDefination = require("./Forms/storeItemDefination");
const storeProductDefination = require("./Forms/storeProductDefination");
const transactionDefination = require("./Forms/transactionDefination");
const transferDefination = require("./Forms/transferDefination");
const transferProductDefination = require("./Forms/transferProductDefination");
const userDefination = require("./Forms/userDefination");
const userStoreDefination = require("./Forms/userStoreDefination");
const receiveProductDefination = require("./Forms/receiveProductDefination");
const issueTicketDefination = require("./Forms/issueTicketDefination");
const apiUserDefination = require("./Forms/apiUserDefination");
const endpointDefination = require("./Forms/endpointDefination");

const fieldRules = {
	"user": userDefination,
	"userRole": roleDefination,
	"choice": choiceDefination,
	"inventory_item": inventoryDefination,
	"delivery": deliveryDefination,
	"attachment": attachmentDefination,
	"attachment_document": attachmentDocument,
	"product": productDefination,
	"customer": customerDefination,
	"store": storeDefination,
	"store_item": storeItemDefination,
	"store_product": storeProductDefination,
	"purchase": purchaseDefination,
	"purchase_item": purchaseItemDefination,
	"service": serviceDefination,
	"production": productionDefination,
	"auto_number": autoNumberDefination,
	"production_consumption": productionConsumptionDefination,
	"finished_product": finishedProductDefination,
	"activity": activityDefination,
	"sell": sellDefination,
	"sell_product": sellProductDefination,
	"account": accountDefination,
	transaction: transactionDefination,
	user_store: userStoreDefination,
	transfer: transferDefination,
	transfer_product: transferProductDefination,
	receive_product: receiveProductDefination,
	issue_ticket: issueTicketDefination,
	order: require("./Forms/orderDefination"),
	"main_transaction": require("./Forms/mainTransaction"),
	"api_user": apiUserDefination,
	"endpoint": endpointDefination,
	flow_defination: require("./Forms/flowDefination"),
	process: require("./Forms/processDefination"),
	waiting_process: require("./Forms/waitingProcessDefination"),
	post: require("./Forms/postDefination"),
	ui_component: require("./Forms/UIComponentDefination"),
	system_nav: require("./Forms/systemNavigationDefination"),
};

module.exports = fieldRules;
