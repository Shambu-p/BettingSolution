const fs = require("fs");
// const path = require("path");

// const definitionsDir = path.join(__dirname, "definitions");
const definitionsDir = "./configuration/definitions";

function loadDefinitions() {
    const files = fs.readdirSync(definitionsDir);
    const rules = {};

    for (const file of files) {
        if (file.endsWith(".json")) {
            const json = JSON.parse(
                fs.readFileSync(path.join(definitionsDir, file), "utf8")
            );
            rules[json.id] = json;
        }
    }

    return rules;
}

module.exports = loadDefinitions();
