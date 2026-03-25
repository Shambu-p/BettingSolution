import React, { Suspense } from "react";
import IssueForm from "./IssueForm";
import CreateSell from "./CreateSell";
import CreatePurchase from "./CreatePurchase";
import ProductionForm from "./ProductionForm";
import FinanceDashboard from "../Views/FinanceDashboard";
import StoreManagerDashboard from "../Views/StoreManagerDashboard";
import TransferForm from "./TransferForm";
import DailySellsReport from "../Views/DailySellsReport";
import ReceivingSlip from "./ReceivingSlip";
import expenseForm from "./expenseForm";
import GeneralReport from "../Views/GeneralReport";
import EndpointDesigner from "./EndpointDesigner";
import FlowDesigner from "./FlowDesigner";
import FlowBuilder from "./FlowBuilder";
import FlowTesterPage from "./FlowTesterPage";
import ProcessDetail from "./ProcessDetail";
import PageBuilder from "./PageBuilder";
import ErrorPage from "../Views/Error";


//// import section ////
// import YayalPage from "./YayalPage";
// import BuilderHomePage from "./BuilderHomePage";
import EyukaPage from "./EyukaPage";
import YohannesComponent from "./YohannesComponent";
import CustomPage from "./CustomPage";
import AbComponent from "./AbComponent";
import Mikcomponent from "./Mikcomponent";
import SamiGreate from "./SamiGreate";
//// import section ////

async function ComponentRegistry() {

  const registry: Record<string, any> = {
    "create-sell": CreateSell,
    "production-form": ProductionForm,
    "transfer-form": TransferForm,
    "create-purchase": CreatePurchase,
    "finance-dashboard": FinanceDashboard,
    "store-dashboard": StoreManagerDashboard,
    "store-report": DailySellsReport,
    "general-report": GeneralReport,
    "receive-slip": ReceivingSlip,
    "issue-form": IssueForm,
    "new-expense": expenseForm,
    "api-designer": EndpointDesigner,
    "flow-designer": FlowDesigner,
    "flow-builder": FlowBuilder,
    "test-flow": FlowTesterPage,
    "process-detail": ProcessDetail,
    "page-builder": PageBuilder,



	// "builder-table-def": TableDefination,
	// "builder-related-list": RelatedListConfigForm,
	// "builder-button-config": ButtonConfigForm,
	// "builder-field-config": FieldConfig,

    // "adc1aaa7-debf-4157-b454-8850412d5cad": YohannesComponent,
    // "c4cc9893-fd5a-4070-8960-bf37ccb34cd1": AbComponent,
    // "df172af0-2c69-4ccb-807d-591087b74d4b": Mikcomponent,
    // "b8b8ce04-4e2b-469b-92f9-57b270ff6744": CustomPage,
  
    // default: ErrorPage,

  };

  //// mapping section ////


	try {
		registry["a6c6c485-5688-45c8-9fc0-dbc804133494"] = (await import("./EyukaPage")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'EyukaPage':", err);
		registry["a6c6c485-5688-45c8-9fc0-dbc804133494"] = ErrorPage;
	}


	try {
		registry["adc1aaa7-debf-4157-b454-8850412d5cad"] = (await import("./YohannesComponent")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'YohannesComponent':", err);
		registry["adc1aaa7-debf-4157-b454-8850412d5cad"] = ErrorPage;
	}


	try {
		registry["b8b8ce04-4e2b-469b-92f9-57b270ff6744"] = (await import("./CustomPage")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'CustomPage':", err);
		registry["b8b8ce04-4e2b-469b-92f9-57b270ff6744"] = ErrorPage;
	}


	try {
		registry["c4cc9893-fd5a-4070-8960-bf37ccb34cd1"] = (await import("./AbComponent")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'AbComponent':", err);
		registry["c4cc9893-fd5a-4070-8960-bf37ccb34cd1"] = ErrorPage;
	}


	try {
		registry["df172af0-2c69-4ccb-807d-591087b74d4b"] = (await import("./Mikcomponent")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'Mikcomponent':", err);
		registry["df172af0-2c69-4ccb-807d-591087b74d4b"] = ErrorPage;
	}


	try {
		registry["9095c623-e715-4a25-abe5-2e36f2c8b71d"] = (await import("./SamiGreate")).default;
	}catch (err) {
		console.error("❌ Failed to load component 'SamiGreate':", err);
		registry["9095c623-e715-4a25-abe5-2e36f2c8b71d"] = ErrorPage;
	}

//// mapping section ////
  
  return registry;

}
// Preloaded registry

export default ComponentRegistry;