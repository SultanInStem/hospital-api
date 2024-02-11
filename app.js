require('dotenv').config(); 
const connect = require('./db/connect'); 
const ErrorHandler = require('./errorHandlers/ErrorHandler');
const NotFound = require("./errorHandlers/NotFound"); 

// SECURITY PACKAGES 
const cors = require('cors');
const mongo_sanitize = require('express-mongo-sanitize')
const helmet = require('helmet'); 
// ------------------ 


const PORT = process.env.PORT || 3000; 
const express = require('express'); 
const app = express();

// ROUTERS 
const AdminRouter = require('./routes/AdminRouter'); 
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

app.use(ErrorHandler); 
app.use(NotFound);
