import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import TaskRoute from "./routes/TaskRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TrialTaskRoute from "./routes/TrialTaskRoute.js";
import SubTaskRoute from "./routes/SubTaskRoute.js";

dotenv.config();

const app = express();

// auto create database
(async()=>{
    await db.sync();
})();

// Increase the payload size limit (e.g., 1000mb)
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

app.use(cors({ origin : 'http://localhost:3000', credentials : true }));

app.use(express.json());
app.use(UserRoute);
app.use(TaskRoute);
app.use(TrialTaskRoute);
app.use(SubTaskRoute);
app.use(AuthRoute);

// store.sync(); 
app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...')
});
