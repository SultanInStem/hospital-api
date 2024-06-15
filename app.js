import "./dotenv.js";
import connect from "./db/connect.js";
import ErrorHandler from "./errorHandlers/ErrorHandler.js"; 
import NotFound from "./errorHandlers/NotFound.js"; 
import ipRecords from "./access-records/ipRecords.js";
import Auth from "./middleware/Auth.js";
import AuthAdmin from "./middleware/AuthAdmin.js";
import AuthManager from "./middleware/AuthManager.js";
// SECURITY PACKAGES 
import cors from "cors";
import mongo_sanitize from "express-mongo-sanitize"; 
import helmet from "helmet";
// ------------------ 


const PORT = process.env.PORT || 3000; 
import express from "express";
const app = express();

// ROUTERS 
import AdminRouter from './routes/AdminRouter.js'; 
import DoctorRouter from './routes/DoctorRouter.js'; 
import AuthRouter from "./routes/AuthRouter.js";  
import PublicRouter from "./routes/PublicRouter.js"; 
import ManagerRouter from "./routes/ManagerRouter.js";
//--------
app.use(express.json());
app.use(cors({
    origin: "*"
}));  
app.use(mongo_sanitize());
app.use(helmet());  
app.disable('x-powered-by');

const start = async () => {
    try{
        await connect(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log('server is running'); 

            const ipAddressIntervalId = setInterval(() => {
                ipRecords.clear();
            }, 3600000); 

            const dbCleanupIntervalId = setInterval(() => {
                console.log("this function runs once a day");
            }, 1000 * 60 * 60 * 24);
            process.on("SIGINT", () => {
                console.log("Server is shutting down...");
                clearInterval(ipAddressIntervalId);
                clearInterval(dbCleanupIntervalId);
                process.exit();
            }); 
            process.on("SIGTERM", () => {
                console.log("Server is shutting down...");
                clearInterval(ipAddressIntervalId);
                clearInterval(dbCleanupIntervalId); 
                process.exit(); 
            }); 
        });  

    }catch(err){
        console.log(err)
    }
}
start(); 

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Server is live!</h1>")
})
app.use("/api/v1/manager", AuthManager, ManagerRouter); 
app.use("/api/v1/admin", AuthAdmin, AdminRouter);
app.use("/api/v1/doctor", Auth, DoctorRouter); 
app.use("/api/v1/auth", AuthRouter); 
app.use("/api/v1/public", Auth, PublicRouter);


app.use(ErrorHandler); 
app.use(NotFound);


export default app;