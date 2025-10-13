const express = require("express");
const Commands = require("./command");

const MainRoute = express.Router();

MainRoute.get("/restart", async (req, res) => {

    // Authenticate the user before restarting the server
    if (!req.headers.authorization || !(await Commands.authenticate(req.headers.authorization))) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    await Commands.restartMainServer();

    res.json({
        message: "restarting server..."
    });

});

MainRoute.get("/stop", async (req, res) => {

    // Authenticate the user before restarting the server
    if (!req.headers.authorization || !(await Commands.authenticate(req.headers.authorization))) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    await Commands.stopMainServer();

    res.json({
        message: "server stopped."
    });

});

module.exports = MainRoute;