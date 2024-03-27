import { StatusCodes } from "http-status-codes";
import Queue from "../../../db/models/Queue.js";

const getPatientQueue = async (req, res, next) => {
    try{
        const queue = await Queue.findOne({})
        return res.status(StatusCodes.OK).json({success: true,queue})
    }catch(err){
        return next(err); 
    }
}


export default getPatientQueue; 