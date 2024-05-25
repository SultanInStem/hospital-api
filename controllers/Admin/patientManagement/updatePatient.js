import Patient from "../../../db/models/Patient.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import getPatientId from "../../../utils/getPatientId.js";
import User from "../../../db/models/User.js"; 
const MIN_ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH); 
const joiSchema = joi.object({
    phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).optional(),
    dateOfBirth: joi.date().optional(), 
    PCP: joi.string().min(MIN_ID_LENGTH).optional(),
    firstName: joi.string().optional(), 
    lastName: joi.string().optional(),
    gender: joi.string().valid('Male', 'Female').optional(),
    patientId: joi.string().min(MIN_ID_LENGTH).required()
})

const updatePatient = async (req, res, next) => {
    try{
        const data = await validateData(joiSchema,req.body);
        const patientId = data['patientId']; 
        const { PCP, phoneNumber, firstName, lastName} = data; 
        const patient = await Patient.findById(patientId);
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`); 

        // if PCP is about to be updated, check if this doctor even exists 
        if(PCP){
            const doc = await User.findById(PCP);
            if(!doc || doc.role !== 'Doctor') throw new BadRequest(`Doctor with ID ${PCP} not found`);
        }
        //--- 

        // if phoneNum, firstName, or lastName are provided -> update the uniqueId
        if(phoneNumber || firstName || lastName){
            const seed = {
                firstName: firstName ? firstName : patient.firstName,
                lastName: lastName ? lastName : patient.lastName, 
                phoneNumber: phoneNumber ? phoneNumber : patient.phoneNumber
            }; 
            const uniqueId = getPatientId(seed); 
            data['uniqueId'] = uniqueId; 
        }
        //---


        const updatedPatient = await Patient.findByIdAndUpdate(patientId, data); 
        if(!updatedPatient) throw new BadRequest("Failed to update the patient");  

        const response = {
            success: true,
            msg: "Patient has been updated", 
            updatedPatient: updatedPatient
        };
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err); 
    }
}

export default updatePatient; 