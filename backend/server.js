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
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./infrastructure/Swagger/Swagger');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json());

// app.use((req, res, next) => {
//     res.setHeader('X-XSS-Protection', '1;mode=block');
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     next();
// });
app.use(cors());

const dependencies = new ProjectDependencies();
const port = dependencies.port;

//ROUTERS
const crudrouter = new CrudRouter(dependencies);
const systemrouter = new SystemRoute(dependencies);
const flowrouter = new FlowRoute(dependencies);
const filerouter = new FileRouter(dependencies);
const externalAPI = new External(dependencies);
const scriptRoute = new ScriptRoute(dependencies);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/crud", crudrouter.getRoute(dependencies));
app.use("/api/system", systemrouter.getRoute());
app.use("/api/flow", flowrouter.getRoute());
app.use("/api/auth", authRouter(dependencies));
app.use("/api/file", filerouter.getRoute());
app.use("/api/scripts", scriptRoute.getRoute());
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

// setInterval(() => {
//     let manager = new FlowManager(dependencies);
//     manager.fireTimeBased();
// }, 2 * 60 * 1000);
