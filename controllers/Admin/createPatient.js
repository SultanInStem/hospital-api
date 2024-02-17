import { StatusCodes } from 'http-status-codes';
import Patient from '../../db/models/Patient.js';
import joi from 'joi'; 
import getPatientId from '../../utils/getPatientId.js';
const validateData = async (data) => {
    try{
        const schema = joi.object({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            gender: joi.string().required().valid("Male","Female"),
            phoneNumber: joi.string().pattern(/^\+\d{5}-\d{3}-\d{2}-\d{2}$/).required(),
            dateOfBirth: joi.date().required()
        })
        const { error, value } = schema.validate(data); 
        if(error) throw error; 
        return value; 
    }catch(err){
        throw err; 
    }
}
const createPatient = async (req, res, next) => {
    try{
        const data = await validateData(req.body);  
        const seed = {
            firstName: data['firstName'],
            lastName: data['lastName'],
            phoneNumber: data['phoneNumber']
        };
        const patientID = getPatientId(seed);
        data['uniqueId'] = patientID;
        const patient = await Patient.create(data);
        return res.status(StatusCodes.OK).json({success: true, patient})
    }catch(err){
        return next(err); 
    }
}
export default createPatient; 