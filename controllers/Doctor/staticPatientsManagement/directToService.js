import Patient from "../../../db/models/Patient.js"; 
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js"; 
import MedPackage from "../../../db/models/MedPackage.js"; 
import { BadRequest, NotFound } from "../../../customErrors/Errors.js"; 
const MIN_ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH);
const joiSchema = joi.object({
    serviceId: joi.string().min(MIN_ID_LENGTH).required(),
    patientId: joi.string().min(MIN_ID_LENGTH).required() 
}); 

const directToService = async(req, res, next) => {
    try{
        const data = await validateData(joiSchema, req.body); 
        const { serviceId, patientId } = data; 
        const patient = await Patient.findById(patientId);
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`); 
        else if(patient.packages.length < 1) throw new BadRequest("Patient does not have any active packages");
        
        // if patients expiration time is over, remove all the packages and throw an error 
        const currentTime = new Date().getTime(); 
        if(patient.expiresAt - currentTime <= 0){
            
            throw new BadRequest("Patient's time as a static patient has expired");
        }
        const response = { success: true }; 
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err); 
    }
}
export default directToService; 