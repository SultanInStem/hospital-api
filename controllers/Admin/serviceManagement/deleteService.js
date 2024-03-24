import Service from "../../../db/models/Service.js";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../../customErrors/Errors.js";
const deleteService = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const service = await Service.findOneAndDelete({_id: id}); 
        if(!service) throw new NotFound("Service not found"); 
        return res.status(StatusCodes.OK).json({success: true, service, msg: "service has been deleted successfuly"})
    }catch(err){
        return next(err);
    }
}

export default deleteService; 