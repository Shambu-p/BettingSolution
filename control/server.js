const express = require("express");
const cors = require("cors");
const Commands = require("./command");
const MainRoute = require("./MainRoute");
const port = 1515;

const app = express();



// app.use((req, res, next) => {
//     res.setHeader('X-XSS-Protection', '1;mode=block');
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     next();
// });
app.use(cors());


app.use(express.json());

app.use("/api", MainRoute);

app.use((req, res) => {
    try{
        return res.status(404).json(`URL Not Found ${req.originalUrl}`)
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Unknown Error"})
    }
})

app.listen(port, () => {
    console.log(`Kemari controller is listening on port ${port}`);
})