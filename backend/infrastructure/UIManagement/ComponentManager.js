// ComponentManager.js
const fs = require("fs");
const path = require("path");

class ComponentManager {

	baseDir = "";
	registryFile = "";
	routeFile = "";

	constructor(baseDir) {
		this.baseDir = baseDir; // folder where components + registry live
		this.registryFile = `${baseDir}/src/Pages/ComponentRegistry.tsx`;
		this.routeFile = `${baseDir}/src/App.tsx`;
		// this.registryFile = `../frontend/src/Pages/ComponentRegistry.tsx`;
	}

	// Create a new TSX component file
	createComponent(CName, script) {

		const filePath = `${this.baseDir}/src/Pages/${CName}.tsx`;

		if (fs.existsSync(filePath)) {
			throw new Error(`Component "${CName}" already exists`);
		}

		fs.writeFileSync(filePath, script, "utf8");

	}

	// Update existing component file
	updateComponent(CName, script) {

		const filePath = `${this.baseDir}/src/Pages/${CName}.tsx`;

		if (!fs.existsSync(filePath)) {
			throw new Error(`Component "${CName}" does not exist!`);
		}

		fs.writeFileSync(filePath, script, "utf8");

	}

	// Update registry file
	updateRegistry(componentImports, componentMapping) {

        let file_content = fs.readFileSync(this.registryFile, 'utf8');
        let main_array = file_content.split(`//// mapping section ////`);
		main_array[1] = `\n${componentMapping}\n`;
		let pre_content = main_array.join(`//// mapping section ////`);
		let imp_array = pre_content.split('//// import section ////');
		imp_array[1] = `\n${componentImports}\n`;

        fs.writeFileSync(this.registryFile, imp_array.join('//// import section ////'), 'utf8');
        // console.log('script has been saved');

	}

	updateRouteMapping(desktopMapping, mobileMapping) {

        let file_content = fs.readFileSync(this.routeFile, 'utf8');
        let main_array = file_content.split(`{/* Desktop Route Mapping */}`);
		main_array[1] = `\n${desktopMapping}\n`;
		let pre_content = main_array.join(`{/* Desktop Route Mapping */}`);

		let mobile_array = pre_content.split(`{/* Mobile Route Mapping */}`);
		mobile_array[1] = `\n${mobileMapping}\n`;
        fs.writeFileSync(this.routeFile, mobile_array.join('{/* Mobile Route Mapping */}'), 'utf8');
        // console.log('script has been saved');

	}

	buildRouteMapping(Components) {

		let desktopComponents = [], mobileComponents = [];
		// componentImports = [];

		Components.forEach(comp => {
			if(comp.usage === "mobile" || comp.usage === "both") {
				mobileComponents.push(`		<Route path="${comp.sys_id}${comp.route_params ?? ""}" element={<Pages page={"${comp.sys_id}"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />`);
			}else if(comp.usage === "desktop" || comp.usage === "both") {
				desktopComponents.push(`		<Route path="${comp.sys_id}${comp.route_params ?? ""}" element={<Pages page={"${comp.sys_id}"} parentType="main_ui" routeData={{}} dataPassed={{}} />} />`);
			}
			// componentImports.push(`import ${comp.name} from "./Pages/${comp.name}";`);
		});

		return {
			desktop: desktopComponents.join("\n"),
			mobile: mobileComponents.join("\n")
			// imports: componentImports.join("\n")
		};

	}

	buildComponentRegistry(Components) {

		let allComponents = [], componentImports = [];

		Components.forEach(comp => {
				componentImports.push(`import ${comp.name} from "./${comp.name}";`);
				allComponents.push(`
	try {
		registry["${comp.sys_id}"] = (await import("./${comp.name}")).default;
	}catch (err) {
		console.error("❌ Failed to load component '${comp.name}':", err);
		registry["${comp.sys_id}"] = ErrorPage;
	}
`);
// 				allComponents.push(`import("./${comp.name}").then(mod => {
//     registry["${comp.sys_id}"] = mod.default;
//   }).catch((err) => {
//     console.error("❌ Failed to load component '${comp.name}':", err);
//   });`);
		});

		return {
			components: allComponents.join("\n"),
			imports: componentImports.join("\n")
		};

	}

}

module.exports = ComponentManager;
