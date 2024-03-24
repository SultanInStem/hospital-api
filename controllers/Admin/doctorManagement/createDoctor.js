import { StatusCodes } from 'http-status-codes';
import User from '../../../db/models/User.js';
import { Unauthorized } from "../../../customErrors/Errors.js";
import validateData from '../../../utils/validateData.js';
import joi from "joi"; 

const valSchema = joi.object({
    isAdmin: false,
    username: joi.string().required().min(5),
    password: joi.string().required().min(6), 
    firstName: joi.string().required().min(2),
    lastName: joi.string().required().min(2),
    specialty: joi.array().items(joi.string()).required(),
    phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).required(),
    role: joi.string().valid('Doctor').required()
})

const createDoctor = async(req, res, next) => {
    try{
        const adminId = req.userId; 
        const admin = await User.findOne({_id: adminId}); 
        if(!admin.isAdmin) throw new Unauthorized("Unauthorized to perform this action"); 
        const data = await validateData(valSchema, req.body); 
        const doctor = await User.create(data); 
        return res.status(StatusCodes.CREATED).json({success: true, doctor})
    }catch(err){
        return next(err); 
    }
}

export default createDoctor; 