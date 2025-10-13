const fieldRules = require('../../../configuration/fieldRules');
const FieldType = require('../../../Interface/FieldType');
const FieldsMapper = require('../../FieldMapper');
const Utils = require('../Utils');

class RoleBasedValidator {

    Rules;
    Changes;
    NewData;
    UpdatedData;
    Dependencies;
    Actions = {};
    Results = {};
    CurrentUser;

    constructor(tableName, dependencies, current_user, current_data, new_data) {

        if(!fieldRules[tableName]) {
            throw dependencies.exceptionHandling.throwError(`field rule for table ${tableName} not found!`, 500);
        }

        if(current_data && new_data) {

            this.Changes = FieldsMapper.identifyChanges(FieldsMapper.mapFields(current_data, tableName), new_data);
            if(this.Changes.length == 0){
                throw dependencies.exceptionHandling.throwError("No change detected", 404);
            }

        } else {
            this.Changes = null;
        }

        if(current_data) {
            this.NewData = current_data;
        }

        if(new_data) {
            this.UpdatedData = new_data;
        }

        this.Dependencies = dependencies;
        this.Rules = fieldRules[tableName];
        this.CurrentUser = current_user;

    }

    setAction(column, action) {
        this.Actions[column] = action;
    }

    async validate() {

        let errors = [];

        this.Changes.forEach(change => {

            try {

                if(change.column == "sys_id") {
                    return;
                }

                let column_rule = this.Rules.fields[change.column];

                if(!column_rule) {
                    throw new Error(`rule for ${change.column} not found!`);
                }

                if(column_rule.updateRoles && Utils.roleCheck(this.CurrentUser.Roles, column_rule.updateRoles)) {

                    let assigned_action = this.Actions[change.column];
                    if(assigned_action) {
                        this.Results[change.column] = assigned_action(change, this.Dependencies, this.CurrentUser);
                    }

                } else {
                    this.Results[change.column] = change.old_value;
                }

            } catch(err) {
                errors.push(err.message);
            }
        });

        if(errors.length > 0) {
            throw this.Dependencies.exceptionHandling.throwError(errors.join(", "), 500);
        } else {
            return this.Results;
        }

    }

    async validateCreate() {

        let errors = [];

        let fields = Object.keys(this.Rules.fields);

        fields.forEach(field => {

            try {

                if(field == "sys_id") {
                    return;
                }

                // let data = this.NewData[field];

                let column_rule = this.Rules.fields[field];

                if(!column_rule) {
                    throw new Error(`rule for ${field} not found!`);
                }

                if(column_rule.writeRoles && Utils.roleCheck(this.CurrentUser.Roles, column_rule.writeRoles)) {

                    // let assigned_action = this.Actions[field];
                    // if(assigned_action) {
                    //     this.Results[field] = assigned_action(givenData, data, this.Dependencies, this.CurrentUser);
                    // }
                    if(this.NewData[field]) {
                        this.Results[field] = this.NewData[field];
                    } else if(column_rule.required && column_rule.defaultValue) {
                        this.Results[field] = this.getVariableData(column_rule.defaultValue);
                    } else if(column_rule.type == FieldType.boolean) {
                        this.Results[field] = false;
                    }

                } else {
                    if((column_rule.required && column_rule.defaultValue) || column_rule.defaultValue) {
                        this.Results[field] = this.getVariableData(column_rule.defaultValue);
                    }
                }

            } catch(err) {
                errors.push(err.message);
            }
        });

        if(errors.length > 0) {
            throw this.Dependencies.exceptionHandling.throwError(errors.join(", "), 500);
        } else {
            return this.Results;
        }

    }

    /**
     * 
     * @param {Object} expression 
     * expression object should be like this
     * {
     *    name: "variable name",
     *    property: "proprety name"
     * }
     */
    getVariableData(expression) {

        if(Array.isArray(expression)) {
            return expression.map(exp => (this.getVariableData(exp)));
        }

        if(typeof expression != "object") {

            return expression;
            // if(typeof expression == "number" || typeof expression == "string" || typeof expression == "boolean") {
            // } else {
            //     return null;
            // }

        }

        if(expression.name && expression.name == "currentDate") {
            return new Date().toISOString();
        }

        if(!expression.name || !expression.property) {
            return expression;
        } else if(expression.name == "") {
            throw new Error(`incorrectly written expression found on field rule ${JSON.stringify(expression)}!`);
        }

        let objectData;

        if(expression.name == "currentUser") {
            objectData = this.CurrentUser;
        } else if(expression.name == "currentData") {
            objectData = this.NewData;
        } else if(expression.name == "updatedData") {
            objectData = this.UpdatedData;
        } else if(expression.name == "currentDate") {
            objectData = new Date().toISOString();
        } else {
            throw new Error(`Unknown variable name ${expression.name} on field rule!`);
        }

        if(expression.properties == "") {
            return objectData;
        }

        let properties = expression.property.split(".");
        let temp_data = objectData;

        properties.forEach(prop => {

            if(!temp_data[prop]) {
                throw new Error(`the property named ${expression.property} on variable named ${expression.name} on field rule!`);
            }

            temp_data = temp_data[prop];

        });

        return temp_data;

    }

    prismaQueryGenerator(name, operator, value) {

        let properties = name.split(".");
        let result_query = {};

        for(let i = (properties.length - 1); i >= 0; i -= 1) {

            let property = properties[i];
            if(i == (properties.length - 1)) {
                result_query = { [property]: { [operator]: value } }
            } else {
                result_query = { [property]: result_query };
            }

        }

        return result_query;

    }

    /**
     * 
     * @param {Object} combinedExpression 
     * it should be object having left and right as it's property
     * {
     *    left: object expression,
     *    right: object expression,
     *    operator: operator as string
     * }
     * 
     */
    getConditionResult(combinedExpression) {

        if(typeof combinedExpression != "object" || !combinedExpression.left || !combinedExpression.right || !combinedExpression.operator) {
            throw new Error(`incorrect access condition expression!`);
        }

        let left = this.getVariableData(combinedExpression.left);
        let right = this.getVariableData(combinedExpression.right);

        return Utils.evaluateCondition(combinedExpression.operator, left, right);

    }

    /**
     * check access conditions and returns the result using getConditionResult method and parameters passed on.
     * conditions are checked together with AND connector and group of conditions are check together with OR.
     * conditions with AND connector taken as single term and conditions with OR connector taken as multiple terms
     * RoleBasedValidator class initiation.
     * @returns the result of evaluation on access condition
     */
    checkConditionResult(conditions = null, type = "createAccessCondition") {

        if(!conditions) {

            if(!this.Rules[type] || this.Rules[type].length == 0) {
                return true;
            }

            conditions = this.Rules[type];

        }


        this.Dependencies.logger(conditions);
        if(!Array.isArray(conditions)) {

            if(typeof conditions == "boolean") {
                return conditions;
            } else {
                throw new Error("access condition must be in array format or boolean value!");
            }

        }

        let condition_expression_array = [];
        let bracket_flag = false;

        conditions.forEach((condition, index) => {

            if(!condition.connector) {
                throw new Error("connector should be set for conditions!")
            }

            let result = this.getConditionResult(condition);

            if(condition.connector == "AND") {

                if(bracket_flag && index > 0) {
                    condition_expression_array.push("&&");
                } else if (!bracket_flag && index > 0) {
                    condition_expression_array.push("||")
                }

                if(!bracket_flag) {
                    condition_expression_array.push("(");
                    bracket_flag = true;
                }

                condition_expression_array.push(`${result}`);

            } else {

                if(bracket_flag) {
                    condition_expression_array.push(")");
                    bracket_flag = false;
                }

                if(index > 0) {
                    condition_expression_array.push("||")
                }

                condition_expression_array.push(`${result}`);

            }

        });

        if(bracket_flag) {
            condition_expression_array.push(")");
            bracket_flag = false;
        }

        let result_expression = condition_expression_array.join(" ");
        return eval(result_expression);

    }


    getAllowedAdditionalFilter(filters) {

        let filterConditions = [];
        let errors = [];
        let foundFilter = null;

        if(!Array.isArray(filters)) {

            if(typeof filters == "object") {
                filterConditions.push(filters);
            } else {
                throw new Error("filter condition must be in a correct format!");
            }

        } else {
            filterConditions = filters;
        }

        let singleFilter;
        for(let i = 0; i < filterConditions.length; i++){

            singleFilter = filterConditions[i];

            if(typeof singleFilter != "object" || !singleFilter.condition || !singleFilter.filter) {
                errors.push(`additional filter at index ${i} is incorrectly expressed! it is not object or doesn't have condition property or filter property!`);
                continue;
            }

            try {

                let condition_result = this.checkConditionResult(singleFilter.condition);
                if(condition_result) {
                    foundFilter = singleFilter.filter;
                    break;
                }

            } catch(err) {
                errors.push(err.message);
            }

        }

        return foundFilter;

    }

    prepareAdditionalFilter() {

        const conditions = this.getAllowedAdditionalFilter(this.Rules.additionalFilter);

        this.Dependencies.logger("conditions 1 ", conditions, this.Rules.additionalFilter);
        if(!conditions || (Array.isArray(conditions) && conditions.length == 0)) {
            return null;
        }
        
        if(!Array.isArray(conditions)) {
            throw new Error("filter condition must be in array format!");
        }
        this.Dependencies.logger("third condition ", conditions);

        let condition_expression_array = [];
        let bracket_flag = false;
        let or_conditions = [];
        let condition, result;

        // conditions.forEach((condition, index) => {
        for(let j = 0; j < conditions.length; j++) {

            condition = conditions[j];
            if(!condition.connector) {
                throw new Error("connector should be set for additional filters!");
            }

            if(!condition.operator) {
                throw new Error("operator should be set for additional filters!");
            }

            result = this.prismaQueryGenerator(condition.column, condition.operator, this.getVariableData(condition.value));

            this.Dependencies.logger("query result ", result);
            if(condition.connector == "OR") {

                if(!bracket_flag) {
                    bracket_flag = true;
                }

                or_conditions.push(result);

            } else {

                if(bracket_flag) {
                    condition_expression_array.push({ OR: or_conditions});
                    bracket_flag = false;
                    or_conditions = [];
                }

                condition_expression_array.push(result);

            }

        };

        return condition_expression_array;

    }

    static async dataLoaderWithObject(tableName, data, currentUser, dependencies) {

        let current_table_rule = fieldRules[tableName];

        if(!current_table_rule) {
            throw new Error(`table rule for ${tableName} not found!`);
        }

        let keys = current_table_rule.keys ?? [];
        let result_data = {...data};

        for(let i = 0; i < keys.length; i++) {

            let key = keys[i];
            if(data[key.column]) {
                result_data[key.property] = await RoleBasedValidator.dataLoaderWithId(key.table, data[key.column], currentUser, dependencies, false);
            }

        }

        return result_data;

    }
    
    static async dataLoaderWithId(tableName, sys_id, currentUser, dependencies, load_related = false, load_children = false) {

        let current_table_rule = fieldRules[tableName];
        let include = {};

        if(!current_table_rule) {
            throw new Error(`table rule for ${tableName} not found!`);
        }

        if(load_related) {

            let keys = current_table_rule.keys ?? [];
            
            keys.forEach(key => {
    
                if(!key.table || !key.column || !key.property) {
                    throw new Error(`key should be set correctly on table ${tableName} rule!`);
                }
                
                if(RoleBasedValidator.checkAccessOnTable(key.table, currentUser, "readRoles")) {
                    include[key.property] = true;
                }
                
            });
        
        }

        if(load_children) {

            let children = current_table_rule.children ?? [];
            children.forEach(child => {

                if(!child.table || !child.property) {
                    throw new Error(`child should be set correctly on table ${tableName} rule!`);
                }

                if(RoleBasedValidator.checkAccessOnTable(child.table, currentUser, "readRoles")) {
                    include[child.property] = true;
                }

            });

        }


        let result;
        if(Array.isArray(sys_id)) {
            result = await dependencies.databasePrisma[tableName].findMany({
                where: { sys_id: { in: sys_id } },
                include
            });
        } else {
            result = await dependencies.databasePrisma[tableName].findFirst({
                where: { sys_id },
                include
            });
        }

        return result;

    }
    
    static async dataLoaderWithCondition(tableName, condition, currentUser, dependencies, load_related = false, load_children = false) {

        let current_table_rule = fieldRules[tableName];
        let include = {};

        if(!current_table_rule) {
            throw new Error(`table rule for ${tableName} not found!`);
        }

        if(load_related) {

            let keys = current_table_rule.keys ?? [];
            
            keys.forEach(key => {
    
                if(!key.table || !key.column || !key.property) {
                    throw new Error(`key should be set correctly on table ${tableName} rule!`);
                }
                
                if(RoleBasedValidator.checkAccessOnTable(key.table, currentUser, "readRoles")) {
                    include[key.property] = true;
                }
                
            });
        
        }

        if(load_children) {

            let children = current_table_rule.children ?? [];
            children.forEach(child => {

                if(!child.table || !child.property) {
                    throw new Error(`child should be set correctly on table ${tableName} rule!`);
                }

                if(RoleBasedValidator.checkAccessOnTable(child.table, currentUser, "readRoles")) {
                    include[child.property] = true;
                }

            });

        }

        let result = await dependencies.databasePrisma[tableName].findFirst({
            where: condition,
            include
        });

        return result;

    }

    static checkAccessOnTable(tableName, currentUser, type = "readRoles") {

        let current_table_rule = fieldRules[tableName];

        if(!current_table_rule) {
            throw new Error(`table rule for ${tableName} not found!`);
        }

        let allowedRoles = current_table_rule[type];
        let intersaction = allowedRoles.filter(role => (currentUser.Roles.includes(role)));

        return (intersaction.length > 0)

    }

}

module.exports = RoleBasedValidator;