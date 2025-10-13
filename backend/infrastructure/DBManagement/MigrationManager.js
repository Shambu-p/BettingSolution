const { exec } = require('child_process');
const fs = require('fs');
const FieldType = require('../../Interface/FieldType');
const prisma = require("@prisma/client");
const FieldsMapper = require('../FieldMapper');

class MigrationManager {

    static updateSchema(collections, schema_path) {

        let result = '';
        let typeMap = {
            "date": "DateTime",
            "datetime-local": "DateTime",
            "boolean": "Boolean",
            "number": "Int",
            "double": "Float",
            "float": "Float",
            "json": "Json"
        };

        let stringTypes = [
            FieldType.string,
            FieldType.choice,
            FieldType.longText,
            FieldType.script,
            FieldType.reference,
            FieldType.email,
            FieldType.password,
            FieldType.richText,
            FieldType.image,
            FieldType.file,
            FieldType.color,
        ];

        collections.forEach((collection) => {

            let collectionString = `model ${collection.name} {\n  sys_id\t\t\tString\t\t@id @default(uuid())\n`;

            Object.keys(collection.fields).forEach((anket) => {

                if(anket == "sys_id") {
                    return;
                }

                let additional = "";
                if(collection.fields[anket].unique) {
                    additional += `@unique`;
                }

                if([FieldType.string, FieldType.choice, FieldType.email, FieldType.password].includes(collection.fields[anket].type)) {
                    additional += ` @db.VarChar(${collection.fields[anket].maxLength ?? 10})`;
                } else if([FieldType.longText, FieldType.script, FieldType.richText].includes(collection.fields[anket].type)) {
                    additional += ` @db.LongText`;
                } else if(collection.fields[anket].type == FieldType.reference) {
                    additional += ` @db.VarChar(36)`;
                } else if(collection.fields[anket].type == FieldType.double) {
                    additional += ` @db.Double`;
                } else if(collection.fields[anket].type == FieldType.float) {
                    additional += ` @db.Float`;
                }

                collectionString += `  ${anket}\t\t\t${
                    stringTypes.includes(collection.fields[anket].type) ? "String" : typeMap[collection.fields[anket].type]
                }${collection.fields[anket].required ? "" : "?"}\t\t${additional}\n`;

            });

            collectionString += `\n\n`;
            collection.children.forEach(rel => {
                collectionString += `  ${rel.property}\t\t\t${rel.table}[]\t\t@relation("${rel.id}")\n`
            });

            collection.keys.forEach(rel => {
                collectionString += `  ${rel.property}\t\t\t${rel.table}${collection.fields[rel.column].required ? "" : "?"}\t\t@relation("${rel.id}", fields: [${rel.column}], references: [sys_id])\n`
            });

            collectionString += '}\n\n';
            result += collectionString;

        });

        let current_schema = fs.readFileSync(schema_path, "utf8");
        let schema_parts = current_schema.split("//// customization tables ////");
        let base_schema = schema_parts[0];
        if(base_schema) {
            base_schema += "//// customization tables ////\n\n";
            base_schema += result;
            fs.writeFileSync(schema_path, base_schema);
        } else { 
            throw new Error("base schema not found!");
        }

        // console.log('File written successfully');
    }

    static async backupData(backup_folder, database, collections) {

        for(let single_table of collections.sort((a, b) => (a.backup_order > b.backup_order ? 1 : -1))) {

            if(prisma.Prisma.ModelName[single_table.name]) {

                fs.writeFileSync(
                    `${backup_folder}/${single_table.name}_backup.json`,
                    JSON.stringify(
                        await database[single_table.name].findMany()
                    ),
                    'utf8'
                );

                console.log(`${single_table.name} backed up`);

            } else {
                console.log(`${single_table.name} table not found!`);
            }

        }

    }

    static async cleanData(database, table_names, collections) {

        let all_table = table_names.map(nm => collections[nm]).sort((a, b) => (a.backup_order < b.backup_order ? 1 : -1));

        for(let delete_single of all_table) {
            if(prisma.Prisma.ModelName[delete_single.name]) {
                await database[delete_single.name].deleteMany();
            }
        }

    }

    static async cleanDataForRestore(collections, database) {

        // if(!fs.existsSync(`${backup_folder}/sys_table_backup.json`)) {
        //     throw new Error("corrupted backup files!");
        // }

        let all_table = collections.sort((a, b) => (a.backup_order < b.backup_order ? 1 : -1));

        for(let delete_single of all_table) {
            if(prisma.Prisma.ModelName[delete_single.name]) {
                await database[delete_single.name].deleteMany();
            }
        }

    }

    static async restoreBackupData(backup_folder, database, collections) {

        let all_table = collections.sort((a, b) => (a.backup_order > b.backup_order ? 1 : -1));

        for(let single_table of all_table) {

            if(fs.existsSync(`${backup_folder}/${single_table.name}_backup.json`)) {

                if(prisma.Prisma.ModelName[single_table.name]) {

                    let backup_data = JSON.parse(
                        fs.readFileSync(`${backup_folder}/${single_table.name}_backup.json`, 'utf8')
                    );
                    try {

                        await database[single_table.name].createMany({
                            data: backup_data
                        });

                        console.log(`${single_table.name} backup data restored`);
                        
                    } catch(error) {
                        // console.log(`error occured while restoring ${single_table.name} backup data`);
                        // console.log(error);
                        await this.restoreSingle(single_table.name, database, backup_data);
                    }
    

                } else {
                    console.log(`error table ${single_table.name} not found!`);
                }

            } else {
                console.log(`${single_table.name} backup file not found!`);
            }

        }

    }

    static async restoreSingle(table_id, database, data) {
        
        if(!Array.isArray(data)) {
            console.log("data is not an array! restoring has failed!");
            return;
        }

        let faild_data = [];

        for(let index in data) {

            try {

                let preparedData = FieldsMapper.mapFields(data[index], table_id);
                await database[table_id].create({
                    data: preparedData
                });

            } catch(error){
                faild_data.push(data[index]);
            }

        }

        if(faild_data.length > 0) {
            
            if(data.length > faild_data.length) {
                await this.restoreSingle(table_id, database, faild_data);
            } else {
                console.log(`records with sys_id ${faild_data.map(fd => fd.sys_id).join(", ")} cannot be restored in ${table_id} table`);
            }

        } else {
            console.log(`all data of ${table_id} table has been restored!`)
        }

    }

    static executeCommand(command, directory) {

        return new Promise((resolve, reject) => {
            exec(command, { cwd: directory }, (error, stdout, stderr) => {
                let msg = "";
                if (error) {
                    reject(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    msg += `Stderr: ${stderr}`;
                }
                resolve(msg + stdout);
            });
        });

    }

    static migrateSchema() {
        return MigrationManager.executeCommand("npx prisma migrate dev");
    }

}

module.exports = MigrationManager;