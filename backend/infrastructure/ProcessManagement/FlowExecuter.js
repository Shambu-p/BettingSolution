const fs = require("fs");
const FlowDBAccess = require("./FlowDBAccess");
const FlowActions = require("./FlowActions");
const ConditionValidator = require("../service/validation/conditionValidation");
const SMSService = require("../service/SMS/SMSservice");

class FlowExecuter {

	runtimeFile;
	flowSpec;
	dbAccess;
	dependencies;
	NotificationService;
	flowId;
	processId;
	isSubFlow = false;

	// DB access methods

	// resolveValue, evaluateConditions, parseConditionToPrisma are functions passed from FlowManager
	// They are used to resolve dynamic values and evaluate conditions within the flow context
	// This allows FlowExecuter to remain agnostic of the specific implementation details
	// resolveValue;
	// evaluateConditions;
	// parseConditionToPrisma;


	constructor( flow_id, process_id, spec, deps, is_sub_flow = false) {

		this.runtimeFile = `./Runtime/ProcessData/${process_id}.json`;
		this.dbAccess = new FlowDBAccess(deps);
		this.dependencies = deps;
		this.NotificationService = new SMSService(deps);
		this.flowSpec = spec;
		this.flowId = flow_id;
		this.processId = process_id;
		this.isSubFlow = is_sub_flow;

	}

	async executeAction(actionSpec, runtimeFile, flowId) {

		let runtimeData = this.#loadRuntimeData(runtimeFile);
		runtimeData.completedStates = runtimeData.completedStates || [];

		const internalName = actionSpec.data.internalName;

		// Skip already completed actions (except decisionNode & approvalNode)
		if (
			!["decisionNode", "approvalNode"].includes(actionSpec.data.type) &&
			runtimeData.completed_states.includes(internalName)
		) {
			return actionSpec.data.next || null;
		}

		let next;
		switch (actionSpec.data.type) {
			case "decisionNode":
				next = this.#executeDecision(actionSpec, runtimeData);
				break;
			case "getSingle":
				next = await this.#executeFetchSingle(actionSpec, runtimeData);
				break;
			case "fetchMultiple":
				next = await this.#executeFetchMultiple(actionSpec, runtimeData);
				break;
			case "createRecord":
				next = await this.#executeCreateRecord(actionSpec, runtimeData);
				break;
			case "updateRecord":
				next = await this.#executeUpdateRecord(actionSpec, runtimeData);
				break;
			case "forEachLoop":
				next = await this.#executeForEach(actionSpec, runtimeData);
				break;
			case "loopEnd":
				next = await this.#executeLoopEnd(actionSpec, runtimeData);
				break;
			case "advanced":
				next = await this.#executeAdvanced(actionSpec);
				break;
			case "setVariable":
				next = await this.#executeSetVariable(actionSpec);
				break;
			case "setOutPut":
				next = await this.#executeSetOutPut(actionSpec);
				break;
			case "callSubFlow":
				next = await this.#executeSubFlow(actionSpec);
				break;
			case "approvalNode":
				next = this.#executeApproval(actionSpec);
				// If approval not satisfied → stop execution
				if (!next) {
					return null;
				}
				break;
			// case "defaultNode":
			// 	next = actionSpec.data.next || null;
			// 	break;
			default:
				throw new Error(`Unknown action type: ${actionSpec.type}`);
		}

		runtimeData = this.#loadRuntimeData(runtimeFile);
		// Mark action as completed (except decisionNode & pending approvalNode)
		if (
			(
				!(["decisionNode", "loopEnd", "whileLoop", "forLoop", "forEachLoop", "approvalNode"].includes(actionSpec.type)) && 
				!runtimeData.runningLoop && 
				next != 1 && 
				next != -1
			) || (
				actionSpec.type == "approvalNode" && 
				next != -1 && 
				next != 1
			)
		) {
			runtimeData.completed_states.push(internalName);
			// await this.changeProcessState(internalName);
		}

		this.#saveRuntimeData(runtimeFile, runtimeData);

		return next;

	}

	// ---------------------------
	// Private executors
	// ---------------------------

	#executeDecision(actionSpec, runtimeData) {
		for (const option of actionSpec.data.options || []) {
			const { condition = [], next } = option;
			if (ConditionValidator.validate(condition, runtimeData)) {
				return next;
			}
		}
		return actionSpec.data.next || null;
	}

	#executeForEach(actionSpec, runtimeData) {

		let action_data;
		let allData = ConditionValidator.resolveTemplate(actionSpec.data.loopData, runtimeData);
		if(runtimeData.variables[actionSpec.id]) {
			action_data = runtimeData.variables[actionSpec.id];
		} else {
			action_data = {
				current_index: 0,
				current: null
			};
		}

		if( Array.isArray(allData) && action_data.current_index < allData.length && allData[action_data.current_index]) {
			action_data.current = allData[action_data.current_index];
			runtimeData.variables[actionSpec.id] = action_data;
			runtimeData.runningLoop = actionSpec.id;
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
			return actionSpec.data.loopStart || null;
		}

		runtimeData.completed_states.push(actionSpec.id);
		runtimeData.runningLoop = undefined;
		this.#saveRuntimeData(this.runtimeFile, runtimeData);
		return actionSpec.data.next || null;

	}

	#executeLoopEnd(actionSpec, runtimeData) {

		let action_data;
		if(runtimeData.variables[actionSpec.data.next]) {
			action_data = runtimeData.variables[actionSpec.data.next];
			action_data.current_index += 1;
			runtimeData.variables[actionSpec.data.next] = action_data;
		}

		this.#saveRuntimeData(this.runtimeFile, runtimeData);
		return actionSpec.data.next || null;

	}

	async #executeFetchSingle(actionSpec, runtimeData) {
		const tableId = ConditionValidator.resolveTemplate(actionSpec.data.table_id, runtimeData);
		const recordId = ConditionValidator.resolveTemplate(actionSpec.data.record_id, runtimeData);

		const record = await this.dbAccess.fetchRecord(tableId, recordId);
		runtimeData.variables = runtimeData.variables || {};
		runtimeData.variables[actionSpec.data.internalName] = record;
		this.#saveRuntimeData(this.runtimeFile, runtimeData);

		return actionSpec.data.next || null;
	}

	async #executeFetchMultiple(actionSpec, runtimeData) {
		try {

			const tableId = ConditionValidator.resolveTemplate(actionSpec.data.table_id, runtimeData);
			
			const whereCondition = ConditionValidator.conditionArrayToQueryObject(runtimeData, (actionSpec.data.filter_condition || []));
			const records = await this.dbAccess.fetchRecords(tableId, { AND: whereCondition }, actionSpec.data.relation);

			runtimeData.variables = runtimeData.variables || {};
			runtimeData.variables[actionSpec.data.internalName] = records;
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
			return actionSpec.data.next || null;
			
		} catch(error) {
			runtimeData.error_log.push(error.message);
			runtimeData.error_log.push(error.stack);
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
			return -1;
		}


	}

	async #executeCreateRecord(actionSpec, runtimeData) {
		console.log("creating record.... ")
		const tableId = ConditionValidator.resolveTemplate(actionSpec.data.table_id, runtimeData);
		console.log("creating record: ", tableId)

		const resolvedData = {};
		for (const [key, value] of Object.entries(actionSpec.data.record_data || {})) {
			resolvedData[key] = ConditionValidator.resolveTemplate(value, runtimeData);
		}

		const record = await this.dbAccess.createRecord(tableId, resolvedData);

		runtimeData.variables = runtimeData.variables || {};
		runtimeData.variables[actionSpec.data.internalName] = record;
		this.#saveRuntimeData(this.runtimeFile, runtimeData);

		return actionSpec.data.next || null;
	}

	async #executeUpdateRecord(actionSpec, runtimeData) {
		const tableId = ConditionValidator.resolveTemplate(actionSpec.data.table_id, runtimeData);
		const recordId = ConditionValidator.resolveTemplate(actionSpec.data.record_id, runtimeData);

		const resolvedData = {};
		for (const [key, value] of Object.entries(actionSpec.data.record_data || {})) {
			resolvedData[key] = ConditionValidator.resolveTemplate(value, runtimeData);
		}

		const record = await this.dbAccess.updateRecord(tableId, recordId, resolvedData);

		runtimeData.variables = runtimeData.variables || {};
		runtimeData.variables[actionSpec.data.internalName] = record;
		this.#saveRuntimeData(this.runtimeFile, runtimeData);

		return actionSpec.data.next || null;
	}

	async #executeAdvanced(actionSpec) {

		let runtimeData = this.#loadRuntimeData(this.runtimeFile);

		try {

            let script_name = `../../controller/ProcessScript/${this.flowId}_${actionSpec.data.internalName}`;
            let script_function = require(script_name);
            let result = await script_function(this.processId, new FlowActions(this.processId, this.dependencies), {
				dependencies: this.dependencies,
				notification: this.NotificationService
			});

			runtimeData = this.#loadRuntimeData(this.runtimeFile);

			runtimeData.variables = runtimeData.variables || {};
			runtimeData.variables[actionSpec.data.internalName] = result;
			this.#saveRuntimeData(this.runtimeFile, runtimeData);

			return actionSpec.data.next || null;

        } catch(error) {
            this.dependencies.logger(`failed executing process_id: ${this.processId} and flow_id: ${this.flowId}`);
            this.dependencies.logger(error);
			runtimeData.error_log.push(`failed while executing ${actionSpec.data.label}`);
			runtimeData.error_log.push(error.message);
			runtimeData.error_log.push(error.stack);
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
            // await this.changeProcessState("failed");
			return -1;
        }
		
	}

	async #executeSubFlow(actionSpec) {

		let runtimeData = this.#loadRuntimeData(this.runtimeFile);

		try {

			if(actionSpec.data.fw_id == this.flowId) {
				throw new Error("Flow Recursion is not Supported!");
			}

			const FlowManager = require("./FlowManager");
			let fw_manager = new FlowManager(this.dependencies);

			const resolvedData = {};

			if(actionSpec.data.value_type == "object") {

				for (const [key, value] of Object.entries(actionSpec.data.input_data || {})) {
					resolvedData[key] = ConditionValidator.resolveTemplate(value, runtimeData);
				}

			} else {
				resolvedData = ConditionValidator.resolveTemplate(actionSpec.data.input_data, runtimeData)
			}

			let fw_result = await fw_manager.fireManualFlow(resolvedData, actionSpec.data.fw_id);

			runtimeData.variables = runtimeData.variables || {};
			runtimeData.variables[actionSpec.data.internalName] = fw_result;
			this.#saveRuntimeData(this.runtimeFile, runtimeData);

			this.dependencies.logger("sub flow executed successfully..........");

			return actionSpec.data.next || null;

        } catch(error) {
            this.dependencies.logger(`failed executing sub flow with flow_id: ${actionSpec.data.fw_id}`);
            this.dependencies.logger(error);
			runtimeData.error_log.push(`failed while executing ${actionSpec.data.label}`);
			runtimeData.error_log.push(error.message);
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
			return -1;
        }

	}

	async #executeSetVariable(actionSpec) {

		let runtimeData = this.#loadRuntimeData(this.runtimeFile);

		try {

			const resolvedData = {};

			if(actionSpec.data.value_type == "object") {

				for (const [key, value] of Object.entries(actionSpec.data.var_data || {})) {
					resolvedData[key] = ConditionValidator.resolveTemplate(value, runtimeData);
				}

			} else {
				resolvedData = ConditionValidator.resolveTemplate(actionSpec.data.var_data, runtimeData)
			}

			let fl_action = new FlowActions(this.processId, this.dependencies);
			fl_action.setProcessVariable(actionSpec.data.var_name, resolvedData);

			return actionSpec.data.next || null;

        } catch(error) {
            this.dependencies.logger(`failed executing ${actionSpec.id}`);
            this.dependencies.logger(error);
			runtimeData.error_log.push(`failed while executing ${actionSpec.data.label}`);
			runtimeData.error_log.push(error.message);
			runtimeData.error_log.push(error.stack);
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
            return -1;
        }
		
	}

	async #executeSetOutPut(actionSpec) {

		let runtimeData = this.#loadRuntimeData(this.runtimeFile);

		try {

			const resolvedData = {};

			if(actionSpec.data.value_type == "object") {

				for (const [key, value] of Object.entries(actionSpec.data.var_data || {})) {
					resolvedData[key] = ConditionValidator.resolveTemplate(value, runtimeData);
				}

			} else {
				resolvedData = ConditionValidator.resolveTemplate(actionSpec.data.var_data, runtimeData)
			}

			let fl_action = new FlowActions(this.processId, this.dependencies);
			fl_action.setOutPutData(resolvedData);

			return actionSpec.data.next || null;

        } catch(error) {
            this.dependencies.logger(`failed executing ${actionSpec.id}`);
            this.dependencies.logger(error);
			runtimeData.error_log.push(`failed while executing ${actionSpec.data.label}`);
			runtimeData.error_log.push(error.message);
			runtimeData.error_log.push(error.stack);
			this.#saveRuntimeData(this.runtimeFile, runtimeData);
            return -1;
        }

	}

	/**
	 * Executes a trigger and decides if flow should run.
	 *
	 * @param {Object} triggerSpec - Trigger node specification object.
	 * @param {string} flowId - The current flow's ID (used for advanced scripts).
	 * @param {string} current_datetime - The current date and time (used for time-based triggers).
	 * @returns {boolean|Date|null} - Boolean for record triggers, Date for time triggers, null for manual.
	 */
	static async executeTrigger(triggerSpec, flowId, triggerData) {
		const { triggerType, actionType, recurrence, given_datetime, condition, table_id } = triggerSpec.data;

		switch (triggerType) {
			case "record_based":

				if (actionType === "normal") {
					if(triggerData) {
						return ConditionValidator.validate(condition, { trigger_data: triggerData });
					}
				} else {
					return await FlowExecuter._runAdvancedTrigger(flowId, triggerData);
				}

			case "time_based":

				if (actionType === "normal") {
					return FlowExecuter._getNextRecurrence(triggerData, recurrence, given_datetime);
				} else {
					return await FlowExecuter._runAdvancedTrigger(flowId, triggerData);
				}

			case "one_time":
				return new Date(given_datetime);

			case "manual":
				return null; // only starts manually

			default:
				throw new Error(`Unsupported trigger type: ${triggerType}`);
		}
	}

	/**
     * check the record passed if it meets the criteria written in script.
     * @param {string} flow_id flow defination sys_id
     * @param {any} record trigger data passed
     * @returns {boolean} if the record meet the criteria it will return true otherwise false
     */
	static async _runAdvancedTrigger(flow_id, optionData, record) {

		let script_name = `../../controller/ProcessTrigger/${flow_id}`;
        let script_function = require(script_name);
        return await script_function(record, optionData);

	}

	static getFirstAction(triggerData) {
		const { next } = triggerData;
		return next || null;
	}

	/**
     * Get the next recurrence datetime based on recurrence type and reference ISO datetime.
     *
     * @param {string} current_datetime - ISO datetime string used as initial for next time calculation.
     * @param {string} recurrence - Recurrence type (e.g., "every_day", "every_month").
     * @param {string} isoString - ISO datetime string used as template for time/day.
     * @returns {Date} - The next recurrence datetime after "now".
     */
    static _getNextRecurrence(current_datetime, recurrence, isoString) {
        const now = new Date(current_datetime);
        const ref = new Date(isoString);

        let next;

        switch (recurrence) {
            case "every_day": {
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                if (next <= now) {
                    next.setDate(next.getDate() + 1);
                }
                break;
            }

            case "every_week": {
                const targetDay = ref.getDay(); // 0=Sun .. 6=Sat
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                const daysUntil = (targetDay - next.getDay() + 7) % 7 || 7;
                next.setDate(next.getDate() + daysUntil);
                break;
            }

            case "every_weekday": {
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                do {
                    if (next <= now) next.setDate(next.getDate() + 1);
                } while (next.getDay() === 0 || next.getDay() === 6); // skip Sat/Sun
                break;
            }

            case "every_month": {
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    ref.getDate(),
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                if (next <= now) {
                    next.setMonth(next.getMonth() + 1);
                }
                break;
            }

            case "every_month_last_day": {
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    lastDay,
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                if (next <= now) {
                    const nextMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();
                    next = new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        nextMonthLastDay,
                        ref.getHours(),
                        ref.getMinutes(),
                        ref.getSeconds()
                    );
                }
                break;
            }

            case "every_year": {
                next = new Date(
                    now.getFullYear(),
                    ref.getMonth(),
                    ref.getDate(),
                    ref.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                if (next <= now) {
                    next.setFullYear(next.getFullYear() + 1);
                }
                break;
            }

            case "every_hour": {
                next = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    now.getHours(),
                    ref.getMinutes(),
                    ref.getSeconds()
                );
                if (next <= now) {
                    next.setHours(next.getHours() + 1);
                }
                break;
            }

            default:
                throw new Error(`Unsupported recurrence type: ${recurrence}`);
        }

        return next;
    }

	/**
	 * Executes an approvalNode.
	 * - If approval not yet granted, return null (flow stops, not added to completedStates).
	 * - If granted, return next and allow completedStates update.
	 */
	#executeApproval(actionSpec, runtimeData) {
		const isApproved = Boolean(
			this.resolveValue(actionSpec.data.isApproved, runtimeData)
		);

		if (!isApproved) {
			return null; // stop flow, waiting for external event
		}

		return actionSpec.data.next || null;
	}

	// ---------------------------
	// Runtime helpers
	// ---------------------------

	#loadRuntimeData(fileName) {
		try {
			const content = fs.readFileSync(fileName, "utf-8");
			return JSON.parse(content);
		} catch {
			return { variables: {}, completedStates: [] };
		}
	}

	#saveRuntimeData(fileName, data) {
		fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
	}

	async changeProcessState(state_name) {
        const FlowManager = require("./FlowManager");
        await FlowManager.changeProcessState(this.processId, state_name, this.dependencies);
    }

	// ---------------------------
	// Orchestrator
	// ---------------------------

	async start() {

		const actionMap = Object.fromEntries(
			this.flowSpec.actions.map(a => [a.data.internalName, a])
		);

		// let current = FlowExecuter.getFirstAction(this.flowSpec.trigger.data.next);
		// console.log("current action ", current);
		let current = this.flowSpec.trigger.data.next;

		while (current) {
			const action = actionMap[current];
			if (!action) {
				throw new Error(`Action "${current}" not found in flowSpec`);
			}

			const next = await this.executeAction(action, this.runtimeFile, this.flowId);

			if(next == -1) {
				await this.changeProcessState("failed");
				if(this.isSubFlow) {
					let rnt_data = this.#loadRuntimeData(this.runtimeFile);
					throw new Error(rnt_data.error_log.join(", "));
				}
				return;
			} else if(next == 1) {
				return;
			} else if (!next) {
				// Flow stops either because no next or approval pending
				await this.changeProcessState("complete");
				if(this.isSubFlow) {
					let rnt_data = this.#loadRuntimeData(this.runtimeFile);
					return rnt_data.outPutData ?? {};
				}
				return;
			}

			current = next;

		}
	}
}

module.exports = FlowExecuter;