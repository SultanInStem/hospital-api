import { StatusCodes } from "http-status-codes";
import MedPackage from "../../../db/models/MedPackage.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
const joiSchema = joi.object({
    price: joi.number().positive().required(),
    servicesAllowed: joi.array().items(joi.string().min(20)).required()
})

const createMedPackage = async (req, res, next) => {
    try{
        const data = await validateData(joiSchema, req.body); 
        const newPackage = await MedPackage.create(data); 
        return res.status(StatusCodes.CREATED).json({success: true, newPackage}); 
    }catch(err){
        return next(err); 
    }
}

export default createMedPackage; 
