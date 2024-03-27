import { StatusCodes } from "http-status-codes";
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Patient from "../../../db/models/Patient.js";


const validateData = async (body) => {
    try{
        const schema = joi.object({
            patientId: joi.string().required(),
            services: joi.array().items(joi.string()),   
        })
        const {error, value} = schema.validate(body);
        if(error) throw error; 
        return value;
    }catch(err){
        throw err; 
    }
}

const createMedicalRecord = async(req,res, next) => {
    try{
        const data = await validateData(req.body); 
        const patient = await Patient.findOne({_id: data['patientId']}); 
        if(!patient) throw new NotFound("Patient not found"); 
        const services = await Service.find({_id: {$in: data['services']}});
        let totalPrice = 0; 
        // const doctors = [];
        const doctors = {};
        for(let i = 0; i < services.length; i++){
            totalPrice += services[i].price; 
            // doctors.push(services[i].providedBy);
            doctors[services[i].providedBy] = 1;
            
        }     

        const medicalRecord = await PatientMedicalRecord.create(
            {
                totalPrice,
                awaitingProcedures: services,
                patientId: data['patientId'], 
                allDoctorsInvolved: doctors,
                patientFirstName: patient.firstName, 
                patientLastName: patient.lastName
            }
        ); 
        return res.status(StatusCodes.OK).json({success: true, medicalRecord});
    }catch(err){
        return next(err); 
    }
}

export default createMedicalRecord; 