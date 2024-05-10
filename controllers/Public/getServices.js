import Service from "../../db/models/Service.js";
import { StatusCodes } from "http-status-codes";

const getServices = async(req, res, next) => {
    try{
        
        return res.status(StatusCodes.OK).json({success: true})
    }catch(err){
        return next(err); 
    }
}

export default getServices;