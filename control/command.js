const { exec } = require('child_process');
const fs = require("fs");
const axios = require("axios");
const UserRoles = require('../backend/Interface/UserRoles');

class Commands {

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

    static async restartMainServer() {

        let configs = JSON.parse(fs.readFileSync("configuration.json"));
        await Commands.executeCommand(`pm2 restart ${configs.process_id}`, configs.main_server_location);
        // await Commands.executeCommand(`service ${configs.process_id} restart`, configs.main_server_location);

    }

    static async stopMainServer() {

        let configs = JSON.parse(fs.readFileSync("configuration.json"));
        await Commands.executeCommand(`pm2 stop ${configs.process_id}`, configs.main_server_location);
        // await Commands.executeCommand(`service ${configs.process_id} stop`, configs.main_server_location);

    }

    static async authenticate(token) {
        try {
            let configs = JSON.parse(fs.readFileSync("configuration.json"));
            let result = await (axios.create({
                baseURL: configs.main_api_address,
                headers: {
                    authorization: token,
                    "Content-Type": 'application/json'
                }
            }).get("/api/auth/authorize"));

            console.log("Authentication result:", result.data);
            return result.data.Roles.includes(UserRoles.Admin);
        } catch (error) {
            console.error("Authentication failed:", error.message);
            // throw new Error("Authentication failed");
            return false;
        }

        // await Commands.executeCommand(`pm2 stop ${configs.process_id}`, configs.main_server_location);
    }

}

module.exports = Commands;