const fieldRules = require('../configuration/fieldRules');

class FieldsMapper {

    static mapFields(data, table_name) {

        let new_data = {};
        let fields = Object.keys(fieldRules[table_name].fields);

        fields.forEach(field => {
            // if(data[field]) {
            if(data[field] != null || data[field] != undefined) {
                new_data[field] = data[field];
            }
        });

        return new_data;

    }

    static identifyChanges(old_data, new_data) {

        let fields = Object.keys(old_data);
        let new_data_fields = Object.keys(new_data);

        new_data_fields.forEach(fld => {
            if(!fields.includes(fld)) {
                fields.push(fld);
            }
        });

        let changes = [];

        fields.forEach(element => {
            if(!old_data[element] && !new_data[element] || old_data[element] != new_data[element]) {
                changes.push({
                    column: element,
                    new_value: new_data[element],
                    old_value: old_data[element]
                });
            }

        });

        return changes;

    }

}

module.exports = FieldsMapper;