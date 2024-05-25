import Patient from "../../../db/models/Patient.js"; 
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js"; 
import MedPackage from "../../../db/models/MedPackage.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Service from "../../../db/models/Service.js";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js"; 
const MIN_ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH);
const joiSchema = joi.object({
    serviceId: joi.string().min(MIN_ID_LENGTH).required(),
    patientId: joi.string().min(MIN_ID_LENGTH).required() 
}); 

const directToService = async(req, res, next) => {
    try{
        const docId = req.userId; 
        const data = await validateData(joiSchema, req.body); 
        const { serviceId, patientId } = data; 
        const patient = await Patient.findById(patientId);
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`); 
        else if(patient.packages.length < 1) throw new BadRequest("Patient does not have any active packages");
        
        const currentTime = new Date().getTime(); 
        if(patient.expiresAt - currentTime <= 0){ // check expiresAt UNIX time
            await Patient.findByIdAndUpdate(patientId, { $set: { packages: [], expiresAt: 0 } });
            throw new BadRequest("Patient's time as a static patient has expired");
        }else if(!patient.PCP){ // check if PCP is specified
            throw new BadRequest("Primary doctor is not specified. Please refer to admins."); 
        }else if(patient.PCP !== docId){ // check if the doctor is indeed PCP
            throw new BadRequest(`Only doctor with ID ${patient.PCP} is allowed to manage this patient`);  
        }

        // check if the serviceId is allowed by the packages 
        const patientPackages = patient.packages; 
        let isAllowed = false; 
        for(let i = 0; i < patientPackages.length; i++){
            const pkgId = patientPackages[i]; 
            const pkg = await MedPackage.findById(pkgId); 
            if(pkg.servicesAllowed.includes(serviceId)){
                isAllowed = true; 
                break; 
            }
        }
        const service = await Service.findById(
            serviceId, 
            {createdAt: 0, updatedAt: 0, currentQueue: 0, providedBy: 0, price: 0}
        ); 
        if(!service) throw new BadRequest(`Service with ID ${serviceId} not found`); 

        // create medical record 
        const medRecord = await PatientMedicalRecord.create({
            isInpatient: true,
            serviceId: service._id, 
            serviceTitle: service.title,
            patientId: patient._id, 
            patientFirstName: patient.firstName, 
            patientLastName: patient.lastName,
            status: 'queue',
            createdAt: currentTime
        });
        if(!medRecord) throw new BadRequest("Med record hasn't been created. Consult Tech Support.");

        // add medRecord to the currentQueue 
        const updatedService = await Service.findByIdAndUpdate(
            serviceId, 
            { $push: { currentQueue: medRecord._id } }, 
            {projection: {createdAt: 0, providedBy: 0, title: 0, price: 0}}
        );


        const response = { 
            success: true,
            msg: 'Patient has been added to the queue', 
            medicalRecord: medRecord
        }; 
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err); 
    }
}
export default directToService; 