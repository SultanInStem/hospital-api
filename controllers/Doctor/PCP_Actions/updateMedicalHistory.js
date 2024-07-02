import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";

const joiSchema = joi.object({
    medicalHistory: joi.string().max(200).required(), 
    patientId: joi.string().min(mongoIdLength).required()
});


const updateMedicalHistory = async (req, res, next) => {
    try{
        const docId = req.userId; 
        const { patientId, medicalHistory } = await validateData(joiSchema, req.body);
        const patient = await Patient.findById(patientId, { PCP: 1 }); 
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`);
        else if(patient.PCP != docId) throw new Unauthorized("You are not authorized to update this field");
        await Patient.findByIdAndUpdate(patientId, { $set: { medicalHistory: medicalHistory } }, { projection: {medicalHistory: 1} });

        return res.status(StatusCodes.OK).json({success: true, newMedicalHistory: medicalHistory});
    }catch(err){
        return next(err); 
    }
}
export default updateMedicalHistory; 