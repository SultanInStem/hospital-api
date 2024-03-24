import { StatusCodes } from "http-status-codes";
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Queue from "../../../db/models/Queue.js";
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

const addToQueueAfterPayment = async(req,res, next) => {
    try{
        const data = await validateData(req.body); 
        const patient = await Patient.findOne({_id: data['patientId']}); 
        if(!patient) throw new NotFound("Patient not found"); 
        const services = await Service.find({_id: {$in: data['services']}});
        let totalPrice = 0; 
        const doctors = {};
        for(let i = 0; i < services.length; i++){
            totalPrice += services[i].price; 
            doctors[services[i].providedBy] = 1;
        }     

        const medicalRecord = await PatientMedicalRecord.create(
            {totalPrice,services,patientId: data['patientId']}
        ); 
        const queueObj = {
            patientId: patient._id,
            doctors: doctors
        }
        const updatedNetQueue = await Queue.findOneAndUpdate({},{$push: { patientQueue: queueObj }});

        return res.status(StatusCodes.OK).json({success: true, medicalRecord});
    }catch(err){
        return next(err); 
    }
}

export default addToQueueAfterPayment; 