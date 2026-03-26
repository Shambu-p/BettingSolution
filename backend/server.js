const express = require("express");
const cors = require("cors");
const authRouter = require("./infrastructure/routes/auth");
const FileRouter = require("./infrastructure/routes/file");
const CrudRouter = require("./infrastructure/routes/crud");
const SystemRoute = require("./infrastructure/routes/SystemRoute");
const ProjectDependencies = require("./configuration/dependencies");
const FlowManager = require("./infrastructure/ProcessManagement/FlowManager");
const FlowRoute = require("./infrastructure/routes/FlowRoute");
const AuthService = require("./infrastructure/service/authentication/auth");
const External = require("./infrastructure/routes/external");
const ScriptRoute = require("./infrastructure/routes/script");
const AppBuilderRoutes = require("./infrastructure/routes/appBuilderRoutes");
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./infrastructure/Swagger/Swagger');
const http = require("http");
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// app.use(express.json());

// app.use((req, res, next) => {
//     res.setHeader('X-XSS-Protection', '1;mode=block');
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     next();
// });

const liveUsersPath = path.join(__dirname, 'live_users.json');

function getLiveUsers() {
    try {
        const data = fs.readFileSync(liveUsersPath, 'utf8');
        return JSON.parse(data ?? "{}");
    } catch (err) {
        return {};
    }
}

function saveLiveUsers(liveUsers) {
    fs.writeFileSync(liveUsersPath, JSON.stringify(liveUsers, null, 2));
}

const dependencies = new ProjectDependencies();

async function getUser(token) {
    try {
        let user = await dependencies.tokenGenerator.verify(token, dependencies.appSecretKey);/* as JwtPayload*/;
        if(!user) {
            return null;
        }
        return {
            Token: token,
            ...user
        };
    } catch (error) {
        console.error("Error in getUser:", error);
        return null;
    }
}

io.on("connection", (socket) => {
    socket.on("register", async (user_token) => {
        let verified_user = await getUser(user_token);
        if(verified_user) {
            const liveUsers = getLiveUsers();
            if (!liveUsers[verified_user.sys_id]) liveUsers[verified_user.sys_id] = [];
            if (!liveUsers[verified_user.sys_id].includes(socket.id)) liveUsers[verified_user.sys_id].push(socket.id);
            saveLiveUsers(liveUsers);
        }
    });

    socket.on("disconnect", () => {
        const liveUsers = getLiveUsers();
        for (const [userId, ids] of Object.entries(liveUsers)) {
            const idx = ids.indexOf(socket.id);
            if (idx !== -1) {
                ids.splice(idx, 1);
                if (ids.length === 0) delete liveUsers[userId];
                saveLiveUsers(liveUsers);
                break;
            }
        }
    });
});

function emitJsonData(type, userId, data) {
    const liveUsers = getLiveUsers();
    const socketIds = liveUsers[userId] || [];
    socketIds.forEach(socketId => {
        io.to(socketId).emit(type, data);
    });
}

function broadcastJsonData(type, data) {
    const liveUsers = getLiveUsers();
    Object.values(liveUsers).forEach(socketIds => {
        socketIds.forEach(socketId => {
            io.to(socketId).emit(type, data);
        });
    });
}

dependencies.emitJsonData = emitJsonData;
dependencies.broadcastJsonData = broadcastJsonData;
const port = dependencies.port;

// const dependencies = new ProjectDependencies();
// const port = dependencies.port;

//ROUTERS
const crudrouter = new CrudRouter(dependencies);
const systemrouter = new SystemRoute(dependencies);
const flowrouter = new FlowRoute(dependencies);
const filerouter = new FileRouter(dependencies);
const externalAPI = new External(dependencies);
const scriptRoute = new ScriptRoute(dependencies);
const appBuilder = new AppBuilderRoutes(dependencies);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/crud", crudrouter.getRoute(dependencies));
app.use("/api/system", systemrouter.getRoute());
app.use("/api/flow", flowrouter.getRoute());
app.use("/api/auth", authRouter(dependencies));
app.use("/api/file", filerouter.getRoute());
app.use("/api/scripts", scriptRoute.getRoute());
app.use("/api/builder", appBuilder.getRoute());
app.all("/api/external/*", AuthService.authenticateAPI, externalAPI.getRoute());

app.use((req, res) => {

    try {

        return res.status(404).json(`URL Not Found ${req.originalUrl}`);

    } catch(error) {

        console.log(error);
        return res.status(500).json({message: "Unknown Error"});

    }

});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

server.listen(1111, () => {
    console.log(`socket server listening on port 1111`);
});

// setInterval(() => {
//     let manager = new FlowManager(dependencies);
//     manager.fireTimeBased();
// }, 2 * 60 * 1000);
