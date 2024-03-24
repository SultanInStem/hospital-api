import { StatusCodes } from 'http-status-codes';
import CustomError from '../customErrors/CustomError.js'; 
import { MongoServerError } from "mongodb";
import { CastError } from 'mongoose';
const ErrorHandler = (err, req, res, next) => {
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({success: false, msg: err.message})
    }else if(err && err.isJoi){
        const msg = "Input validation error: " + err.details[0].message;
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg});
    }else if(err instanceof MongoServerError && err.code === 11000){
        return res.status(StatusCodes.CONFLICT).json({success: false, msg: err.message})
    }else if(err instanceof CastError){
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: err.message});
    }
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: "Something went wrong"})
}
export default ErrorHandler;
