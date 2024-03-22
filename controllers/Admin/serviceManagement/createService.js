import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";
import Service from "../../../db/models/Service.js"; 
import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 


const validateData = async (body) => {
    try{
        const schema = joi.object({
            title: joi.string().required(),
            price: joi.number().positive().required(), 
            description: joi.string().optional(), 
            providedBy: joi.string().required()
        })
        const {error, value} = schema.validate(body); 
        if(error) throw error; 
        return value;
    }
    catch(err){
        throw err; 
    }
}
const createService = async (req, res, next) => {
    try{
        const { isAdmin } = req;
        if(!isAdmin) throw new Unauthorized("You are not allowed to perform this action"); 
        const data = await validateData(req.body);  
        const staff = await User.findOne({_id: data['providedBy']}); 
        if(!staff) throw new NotFound("Unable to find who is responsible for the service");
        const service = await Service.create(data);
        return res.status(StatusCodes.OK).json({success: true, service, msg: "Service has been created"})
    }catch(err){ 
        return next(err); 
    }
}


export default createService; 