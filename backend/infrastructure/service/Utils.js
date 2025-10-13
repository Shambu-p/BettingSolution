const FieldType = require("../../Interface/FieldType");

const Utils = {

    equalsTo(value1, value2){
        return value1 == value2;
    },

    lessThan(value1, value2){
        return value1 < value2;
    },

    greaterThan(value1, value2){
        return value1 > value2;
    },

    lessEqualTo(value1, value2){
        return value1 <= value2;
    },

    greaterEqualTo(value1, value2){
        return value1 >= value2;
    },

    contains(value1, value2) {

        if(typeof value1 == "string" || Array.isArray(value1)) {
            return value1.includes(value2);
        }

        return false;

    },

    notContains(value1, value2){

        if(typeof value1 == "string" || Array.isArray(value1)) {
            return !value1.includes(value2);
        }

        return true;

    },

    notEqual(value1, value2){
        return value1 != value2;
    },

    evaluateCondition(condition_name, value1, value2) {

        switch(condition_name) {
            case "not":
                return Utils.notEqual(value1, value2);
            case "in":
                return Utils.contains(value1, value2);
            case "contains":
                return Utils.contains(value1, value2);
            case "notIn":
                return Utils.notContains(value1, value2);
            case "lt":
                return Utils.lessThan(value1, value2);
            case "lte":
                return Utils.lessEqualTo(value1, value2);
            case "gt":
                return Utils.greaterThan(value1, value2);
            case "gte":
                return Utils.greaterEqualTo(value1, value2);
            default:
                return Utils.equalsTo(value1, value2);
        }

    },

    checkDate(reference_date, compare_date) {
        // return -1 if compare date is before reference date
        // return 1 if compare date is after reference date
        // return 0 if compare date is same as reference date

        const reference = new Date(reference_date);
        const compare = new Date(compare_date);

        if(reference < compare) {
            return 1;
        } else if(reference > compare) {
            return -1;
        } else {
            return 0;
        }

    },

    roleCheck(data1, data2) {
        return (data2.filter(rl => (data1.includes(rl))).length > 0)
    },

    incrementStringNumber(str) {

        // Convert string to number and increment
        let num = parseInt(str, 10) + 1;
    
        if(num.toString().length < 4) {
            // Convert back to string and pad with leading zeros
            return num.toString().padStart(str.length, '0');
        }else {
            return num.toString();
        }
    
    },

    /**
     * Converts a string to PascalCase.
     * Example: "my component name" => "MyComponentName"
     */
    toPascalCase(str) {
        return str
            .replace(/([_\-\s]+)(.)?/g, (_, __, chr) => chr ? chr.toUpperCase() : "")
            .replace(/^(.)/, (m) => m.toUpperCase());
    }

}

module.exports = Utils;