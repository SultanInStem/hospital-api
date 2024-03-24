import Patient from "../../../db/models/Patient.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../../customErrors/Errors.js";
import getPatientId from "../../../utils/getPatientId.js";
const schema = joi.object({
    phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).optional(),
    dateOfBirth: joi.date().optional()
})

const updatePatient = async (req, res, next) => {
    try{
        const { id } = req.params; 
        const data = await validateData(schema,req.body);
        let updatedPatient = await Patient.findOneAndUpdate({_id: id}, data, {new: true}); 
        if(!updatedPatient) throw new NotFound("Patient not found");
        if(data['phoneNumber'] !== null){
            const patientId = getPatientId(updatedPatient);
            updatedPatient = await Patient.findOneAndUpdate({_id: id}, {uniqueId: patientId}); 
        }
        return res.status(StatusCodes.OK).json({success: true, msg: "Patient has been updated", updatedPatient})
    }catch(err){
        return next(err); 
    }
}

export default updatePatient; 