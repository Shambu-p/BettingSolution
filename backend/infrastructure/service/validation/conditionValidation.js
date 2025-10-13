const fieldRules = require("../../../configuration/fieldRules");
const FieldType = require("../../../Interface/FieldType");

class ConditionValidator {

    // Helper to evaluate a single condition
    static evalSingle(cond, cntx) {
        let left = ConditionValidator.resolveTemplate(cond.left ?? "", cntx);
        let right = ConditionValidator.resolveTemplate(cond.right ?? "", cntx);

        switch (cond.operator) {
            case "equals": return left == right;
            case "not": return left != right;
            case "not_empty": return !ConditionValidator.isEmpty(left);
            case "empty": return ConditionValidator.isEmpty(left);
            case "ls": return Number(left) < Number(right);
            case "gt": return Number(left) > Number(right);
            case "in": return Array.isArray(right) ? right.includes(left) : String(right).split(",").includes(String(left));
            case "not_in": return Array.isArray(right) ? !right.includes(left) : !String(right).split(",").includes(String(left));
            default: return false;
        }
    }

    // Add this function below your component
    static validate(conditions, context) {
        if (!conditions || conditions.length === 0) return true;

        // Group consecutive OR conditions
        const groups = [];
        let i = 0, result;
        while (i < conditions.length) {

            if (conditions[i].connector === "AND") {
                // Start a group
                // groups.push(ConditionValidator.evalSingle(conditions[i], context));
                result = ConditionValidator.evalSingle(conditions[i], context);
                groups.push(result);
                i++;
                
            } else {
                
                // Group consecutive ORs
                let groupResult = ConditionValidator.evalSingle(conditions[i], context);
                i += 1;
                while (i < conditions.length && conditions[i].connector === "OR") {
                    groupResult = groupResult || ConditionValidator.evalSingle(conditions[i], context);
                    i++;
                }

                groups.push(groupResult);

            }

        }

        // Evaluate all groups with AND logic
        return groups.every(Boolean);

    }

    getVariable(expression, the_object) {

        // get value from object using dot separated string in curly brace expression. if not found return undefined
        let parts = expression.split('.')
        for (let part of parts) {
            if (the_object[part] !== undefined) {
                the_object = the_object[part];
            } else {
                return undefined;
            }
        }
        return the_object;
    }

    /**
     * Interpolates the expression with the context values.
     * Example usage:
     * const context = { variable: { user: { title: "Mr", name: "Abnet" } }};
     * ConditionValidator.interpolateExpression("hello there {{variable.user.title}}. {{variable.user.name}} how are you", context);
     * returns: "hello there Mr. Abnet how are you"
     * @param {string} template 
     * @param {any} context 
     * @returns 
     */
    static resolveTemplate(template, context) {
        const placeholderRegex = /{{\s*([^}]+)\s*}}/g;

        // If template is exactly a single placeholder → return raw value
        if(["{{true}}", "{{false}}"].includes(template)) {
            return (template == "{{true}}") 
        }

        const singleMatch = template.match(/^{{\s*([^}]+)\s*}}$/);
        if (singleMatch) {
            return ConditionValidator.getInterpolateExpressionValue(context, singleMatch[1]);
        }

        // Otherwise, replace placeholders with their values
        let result = template.replace(placeholderRegex, (_, path) => {
            const value = ConditionValidator.getInterpolateExpressionValue(context, path);
            if (value === undefined) return "";
            if (typeof value === "object") {
                return JSON.stringify(value); // safely embed object
            }
            return String(value);
        });

        // Try to parse if looks like JSON object or array
        try {
            return JSON.parse(result);
        } catch {
            return result; // if not valid JSON, return as string
        }
    }

    static getInterpolateExpressionValue(obj, path) {

        const keys = path
            .replace(/\[(\d+)\]/g, ".$1") // convert [0] → .0
            .split(".");

        let value = obj;
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;

    }

    static conditionArrayToQueryObject(contextData, filter_obj) {

        //console.log("////////////// validating: ", conditions[i].left, conditions[i].operator, conditions[i].right, " = ", result);

        let result_query = [];
        let temp_or = [];

        let fi = 0;

        while(fi < filter_obj.length) {

            if(filter_obj[fi].connector == "OR") {

                while(fi < filter_obj.length && filter_obj[fi].connector == "OR") {
                    temp_or.push(ConditionValidator.pathToFilterQuery(ConditionValidator.getBaseData(), filter_obj[fi], contextData));
                    fi++;
                }

                result_query.push({
                    OR: temp_or
                });

                temp_or = [];

            } else {
                result_query.push(ConditionValidator.pathToFilterQuery(ConditionValidator.getBaseData(), filter_obj[fi], contextData));
                fi++;
            }

        }

        return result_query;

    }

    static pathToFilterQuery(baseData, singleQuery, cnxData) {

        let split_path = singleQuery.field.split(".");
        let final_json = "{|replace|}";
        let conditionValue = ConditionValidator.resolveTemplate(singleQuery.value || "", cnxData);

        split_path.forEach((sp, index) => {
            final_json = final_json.replace("|replace|", (
                ((split_path.length - 1) > index) ? ConditionValidator.parseSinglePath(baseData, sp) : ConditionValidator.parseSinglePath(baseData, sp, singleQuery.operator, ([FieldType.number, FieldType.boolean].includes(singleQuery.type ) ? conditionValue : `"${conditionValue}"`)))
            )
        });

        return JSON.parse(final_json);

    }

    static parseSinglePath(baseData, path, operator, value) {

        let path_split = path.split("|");

        if((value != null && value != undefined) && operator) {


            if(!baseData[path_split[0]]) {
                throw new Error(`unknow table in filter query! ${path_split[0]}`);
            }

            let column = baseData[path_split[0]]["fields"][path_split[1]];
            // .fields.find((rl) => (rl.sys_id == path_split[1] && rl.table_id == path_split[0]));
            if(!column) {
                throw new Error(`unknow column in filter query! ${path_split[0]}.${path_split[1]}`);
            }

            return `"${column.id}": {"${operator}": ${value}}`;

        } else {

            let table = baseData[path_split[0]];
            if(!table) {
                throw new Error(`unknow table in filter query! ${path_split[0]}`);
            }

            let relation = baseData.keys.find(rl => (rl.column == path_split[1]));
            if(!relation || !relation.property) {
                throw new Error(`unknow relation in filter query! ${path_split[0]}.${path_split[1]}`);
            }

            return `"${relation.property}": {|replace|}`;

        }

    }

    static isEmpty(str) {
        return !str || str.trim() === "";
    }

    static getBaseData() {
        return fieldRules;
    }

}

module.exports = ConditionValidator;