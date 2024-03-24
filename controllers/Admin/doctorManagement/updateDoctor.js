import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { NotFound } from "../../../customErrors/Errors.js";
const schema = joi.object({
    username: joi.string().min(5).optional(),
    phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).optional(),
    specialty: joi.array().items(joi.string()).optional()
})

const updateDoctor = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const data = await validateData(schema, req.body);
        const updatedDoctor = await User.findOneAndUpdate({_id: id}, data, {new: true});
        if(!updateDoctor) throw new NotFound("Doctor not found"); 

        return res.status(StatusCodes.OK).json({success: true, msg: "Doctor has been updated", updatedDoctor})
    }catch(err){
        return next(err); 
    }
}

export default updateDoctor; 