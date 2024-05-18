import { StatusCodes } from 'http-status-codes';
import Patient from '../../../db/models/Patient.js';
import joi from 'joi'; 
import getPatientId from '../../../utils/getPatientId.js';
import validateData from "../../../utils/validateData.js"; 

const schema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    gender: joi.string().required().valid("Male","Female"),
    phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).required(),
    dateOfBirth: joi.date().optional(),
    isStationary: joi.boolean().required(),
    packages: joi.when('isStationary', {
        is: true,
        then: joi.array().items(joi.string()).min(1).required(),
        otherwise: joi.array().forbidden(),
    }),
    expiresAt: joi.when('isStationary', {
        is: true,
        then: joi.number().positive().required(),
        otherwise: joi.number().forbidden()
    })
})

const createPatient = async (req, res, next) => {
    try{
        const data = await validateData(schema, req.body);  
        const seed = {
            firstName: data['firstName'],
            lastName: data['lastName'],
            phoneNumber: data['phoneNumber']
        };
        const patientID = getPatientId(seed);
        data['uniqueId'] = patientID;            
        const patient = await Patient.create(data);
        if(patient['isStationary']){
            
        } 
        return res.status(StatusCodes.CREATED).json({success: true, patient})
    }catch(err){
        return next(err); 
    }
}
export default createPatient; 