const { v4: uuidv4 } = require('uuid');
const Utils = require('../../infrastructure/service/Utils');
const UserRoles = require('../../Interface/UserRoles');
const axios = require('axios');

async function createBranchBefore(reqUser, data, dependencies, smsService) {

    let now = new Date();

    let choiceData = await dependencies.databasePrisma.choice.findFirst({
        where: {
            id: "hasura_url"
        }
    });

    if(!choiceData) {
        throw dependencies.exceptionHandling.throwError("Hasura URL not Defined", 500);
    }

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: choiceData.value,
        headers: {},
        data: {
            "query": "mutation MyMutation($object: Locations_insert_input!) {  insert_Locations_one(object: $object) { \n    id\n    name\n    address\n    createdAt\n  updatedAt\n }\n}",
            "variables": {
                "object": {
                    "name": data.name,
                    "address": data.location,
                    "coordinates": `{ \"type\": \"Point\", \"crs\": { \"type\": \"name\", \"properties\": { \"name\": \"urn:ogc:def:crs:EPSG::4326\" } }, \"coordinates\": [ ${data.longitude}, ${data.latitude} ] }`,
                    "createdAt": now.toISOString(),
                    "updatedAt": now.toISOString()
                }
            },
            "operationName": "MyMutation"
        }
    };

    try {

        let response = await axios(config);
        data.legacy_id = response.data.data.insert_Locations_one.id;

        console.log("Branch location created in hasura with id: ", data.legacy_id, "   for branch: ", response.data.data.insert_Locations_one.id);

    } catch(error) {
        throw dependencies.exceptionHandling.throwError("Error while creating branch location in hasura", 500);
    }

    // await smsService.sendSMS(user.Phone, `Dear ${user.FullName} user your phone number to sign in to your account and the account password is ${password}. Thank you for working with us!`);
    return data;

}

module.exports = createBranchBefore;