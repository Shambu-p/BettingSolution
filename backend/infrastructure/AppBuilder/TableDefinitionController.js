
const path = require("path");
const fs = require("fs-extra");
const { PATHS, listAllDefinitionFiles, readDefinitionFile, writeDefinitionFile, deleteDefinitionFile } = require("./fileUtils.js");
const { validateDefinitionAndFile } = require("./validator.js");

module.exports = {
	async getAll() {

		const files = await listAllDefinitionFiles();
		let list = [];
		for (const f of files) {
			list.push(await readDefinitionFile(f));
		}
		return list;

	},

	async getForList() {

		const files = await listAllDefinitionFiles();
		let list = [], temp = null;
		for (const f of files) {
			temp = await readDefinitionFile(f);
			list.push({application_id: temp.application_id, table_id: temp.id, label: temp.title});
		}

		return list;

	},

	async getOne(application_id, table_id) {

		const f = `${application_id}-${table_id}.json`;
		const full = path.join(PATHS.definitionsDir, f);

		if (!(await fs.pathExists(full))) {
			throw new Error("Table definition not found!");
		} 

		return await readDefinitionFile(f);

	},

	async create(def) {

		const fileName = `${def.application_id}-${def.id}.json`;
		// const err = validateDefinitionAndFile(def, fileName);
		// if (err) return res.status(400).json({ error: err.message });
		const full = path.join(PATHS.definitionsDir, fileName);
		if (await fs.pathExists(full)) throw new Error("Table definition already exists!");

		await writeDefinitionFile(fileName, def);

	},

	async update(def) {

		const fileName = `${def.application_id}-${def.id}.json`;
		const full = path.join(PATHS.definitionsDir, fileName);
		if (!(await fs.pathExists(full))) throw new Error("Table definition not found!");

		await writeDefinitionFile(fileName, def);

	},

	async deleteFile(application_id, table_id) {

		const fileName = `${application_id}-${table_id}.json`;
		await deleteDefinitionFile(fileName);

	}
};
