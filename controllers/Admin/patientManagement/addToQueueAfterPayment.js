import { StatusCodes } from "http-status-codes";
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Pool from "../../../db/models/Pool.js";
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
        const {isAdmin} = req; 
        if(!isAdmin) throw new Unauthorized("Not authorized to create medical records"); 
        const data = await validateData(req.body); 
        const patient = await Patient.findOne({_id: data['patientId']}); 
        if(!patient) throw new NotFound("Patient not found"); 
        const services = await Service.find({_id: {$in: data['services']}});
        let totalPrice = 0; 
        for(let i = 0; i < services.length; i++){
            totalPrice += services[i].price; 
        }     

        const medicalRecord = await PatientMedicalRecord.create(
            {totalPrice,services,patientId: data['patientId']}
        ); 
        const queueObj = {
            patientId: patient._id,
            servicesToGet: services
        }
        const updatedPool = await Pool.findOneAndUpdate({},{$push: {patientQueue: queueObj }});
        console.log(updatedPool);

        return res.status(StatusCodes.OK).json({success: true, medicalRecord});
    }catch(err){
        return next(err); 
    }
}

export default addToQueueAfterPayment; 