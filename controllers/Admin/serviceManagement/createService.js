import { NotFound } from "../../../customErrors/Errors.js";
import Service from "../../../db/models/Service.js"; 
import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";

const schema = joi.object({
    title: joi.string().required(),
    price: joi.number().positive().required(), 
    description: joi.string().optional(), 
    providedBy: joi.string().required()
})

const createService = async (req, res, next) => {
    try{
        const data = await validateData(schema, req.body);  
        const staff = await User.findOne({_id: data['providedBy']}); 
        if(!staff) throw new NotFound("Unable to find who is responsible for the service");
        const service = await Service.create(data);
        return res.status(StatusCodes.OK).json({success: true, service, msg: "Service has been created"})
    }catch(err){ 
        return next(err); 
    }
}


export default createService; 