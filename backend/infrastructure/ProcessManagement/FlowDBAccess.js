const PrismaClient = require("@prisma/client");
const fieldRules = require("../../configuration/fieldRules");
const SystemUser = require("../../controller/auth/SystemUser");
const SMSService = require("../service/SMS/SMSservice");

class FlowDBAccess {

	dependencies;
	NotificationService;

	constructor(deps) {
		this.dependencies = deps;
		this.NotificationService = new SMSService(deps);
	}

	/**
	 * Fetch a single record from a table by sys_id.
	 *
	 * @param {string} tableId - The Prisma model name (e.g., "store").
	 * @param {string} sysId - The record sys_id value.
	 * @returns {Promise<Object|null>} - The found record or null.
	 */
	async fetchRecord(tableId, sysId, relation = "none") {

		if (!(await PrismaClient.Prisma.ModelName[tableId])) {
			throw new Error(`Model "${tableId}" does not exist in Prisma client`);
		}

		let include = {};

		if (relation && ["reference", "reference_children"].includes(relation)) {

			if (fieldRules[tableId] && fieldRules[tableId].keys) {
				let related_tables = fieldRules[tableId].keys;

				related_tables.forEach(related_table => {
					include[related_table.property] = true;
				});
			}

		}

		if (relation && ["children", "reference_children"].includes(relation)) {

			if (fieldRules[tableId] && fieldRules[tableId].children) {
				let related_tables = fieldRules[tableId].children;

				related_tables.forEach(related_table => {
					include[related_table.property] = true;
				});
			}

		}

		return (await this.dependencies.databasePrisma[tableId].findUnique({
			where: { sys_id: sysId },
			include
		}));

	}

	/**
	 * Fetch multiple records with an optional filter.
	 *
	 * @param {string} tableId - The Prisma model name.
	 * @param {Object} where - Prisma "where" filter object.
	 * @returns {Promise<Object[]>} - Array of records.
	 */
	async fetchRecords(tableId, where = {}, relation = "none") {

		if (!(await PrismaClient.Prisma.ModelName[tableId])) {
			throw new Error(`Model "${tableId}" does not exist in Prisma client`);
		}

		let include = {};

		if (relation && ["reference", "reference_children"].includes(relation)) {

			if (fieldRules[tableId] && fieldRules[tableId].keys) {
				let related_tables = fieldRules[tableId].keys;

				related_tables.forEach(related_table => {
					include[related_table.property] = true;
				});
			}

		}

		this.dependencies.logger("where condition to fetch multiple ", { where, include });
		return (await this.dependencies.databasePrisma[tableId].findMany({ where, include }));

	}

	/**
	 * Create a new record in a table.
	 *
	 * @param {string} tableId - The Prisma model name.
	 * @param {Object} data - Fields for the new record.
	 * @returns {Promise<Object>} - The created record.
	 */
	async createRecord(tableId, data) {
		const DefaultController = require("../../controller/DefaultController");
		return await DefaultController.create(SystemUser, tableId, data, this.dependencies, this.NotificationService);
	}

	/**
	 * Update a record by sys_id.
	 *
	 * @param {string} tableId - The Prisma model name.
	 * @param {string} sysId - The record sys_id value.
	 * @param {Object} data - Fields to update.
	 * @returns {Promise<Object>} - The updated record.
	 */
	async updateRecord(tableId, sysId, data) {
		const DefaultController = require("../../controller/DefaultController");
		return await DefaultController.update(SystemUser, tableId, { ...data, sys_id: sysId }, this.dependencies, this.NotificationService);
	}

}

module.exports = FlowDBAccess;