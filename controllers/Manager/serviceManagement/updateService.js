import Service from "../../../db/models/Service.js";
import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import validateData from "../../../utils/validateData.js";
import joi from "joi"; 
import { NotFound } from "../../../customErrors/Errors.js";


const schema = joi.object({
    price: joi.number().allow(0).positive().optional(),
    title: joi.string().optional(),
    providedBy: joi.string().optional(),
    description: joi.string().optional()
})

const updateService = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const data = await validateData(schema, req.body);
        const paths = Service.schema.paths; 
        let updateObj = {}; 
        if(data['providedBy']){
            const staff = await User.findOne({_id: data['providedBy']}); 
            if(!staff) throw new NotFound("Staff with this id does not exist"); 
            updateObj['providedBy'] = staff._id; 
        }
        for(const [key, value] of Object.entries(data)){
            if(data[key] !== null && paths[key] !== null){
                updateObj[key] = value;
            }
        }
        const updatedService = await Service.findOneAndUpdate({_id: id}, updateObj, {new: true}); 
        if(!updatedService) throw new NotFound("Service not found"); 
        return res.status(StatusCodes.OK).json({success: true, msg: "Service has been updated", updatedService})
    }catch(err){
        return next(err); 
    }
}

export default updateService; 