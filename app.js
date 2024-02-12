import "./dotenv.js";
import connect from "./db/connect.js";
import ErrorHandler from "./errorHandlers/ErrorHandler.js"; 
import NotFound from "./errorHandlers/NotFound.js"; 

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
//--------
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(mongo_sanitize());
app.use(helmet());  

const start = async () => {
    try{
        await connect(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log('server is running'); 
        }); 
    }catch(err){
        console.log(err)
    }
}
start(); 

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Server is live!</h1>")
})
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/doctor", DoctorRouter); 

app.use(ErrorHandler); 
app.use(NotFound);
