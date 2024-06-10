import express from "express";
import getAllPatients from "../controllers/Public/Patients/getAllPatients.js"; 
import searchPatients from "../controllers/Public/Patients/searchPatients.js";
import getMedicalRecords from "../controllers/Public/MedicalRecords/getMedicalRecords.js";
import getMedPackages from "../controllers/Public/getMedPackages.js";
import getSinglePatient from "../controllers/Public/Patients/getSinglePatient.js";
import getSingleRecord from "../controllers/Public/MedicalRecords/getSingleMedRecord.js";
import getServices from "../controllers/Public/Services/getServices.js";
import getSingleService from "../controllers/Public/Services/getSingleService.js";
import getSingleDoctor from "../controllers/Public/Doctors/getSingleDoctor.js";
import getDoctors from "../controllers/Public/Doctors/getDoctors.js";
import getPayments from "../controllers/Public/Payments/getPayments.js";
import getSinglePayment from "../controllers/Public/Payments/getSinglePayment.js";
const router = express.Router(); 
// Patients 
router.get('/patients', getAllPatients);
router.get("/patients/search", searchPatients);
router.get("/patients/single/:id", getSinglePatient);
//

// Services 
router.get('/services', getServices); 
router.get("/services/single/:id", getSingleService); 
//

// Medical records
router.get("/medicalrecords", getMedicalRecords);
router.get("/medicalrecords/single/:id", getSingleRecord); // id of the medical record
//

// Doctors 
router.get('/doctors', getDoctors); 
router.get("/doctors/single/:id", getSingleDoctor);
//

// Med-Packages 
router.get('/packages', getMedPackages);
// 

// Payments 
router.get('/payments', getPayments);
router.get('/payments/single/:id', getSinglePayment); 
// 


export default router; 