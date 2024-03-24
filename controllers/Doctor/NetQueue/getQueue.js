import { StatusCodes } from "http-status-codes";
import Queue from "../../../db/models/Queue.js"; 



const getQueue = async(req, res, next) => {
    try{
        const docId = req.userId; 
        const netQueue = (await Queue.find({}))[0]['patientQueue'];
        const localQueue = []; 
        for(let i = 0; i < netQueue.length; i++){
            if(netQueue[i]['doctors'][docId]){
                localQueue.push(netQueue[i].patientId); 
            }
        }
        return res.status(StatusCodes.OK).json({success: true, queue: localQueue})
    }catch(err){
        return next(err); 
    }
}

export default getQueue; 

