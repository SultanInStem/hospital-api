import express from "express";
import getAllPatients from "../controllers/Public/Patients/getAllPatients.js"; 
import searchPatients from "../controllers/Public/Patients/searchPatients.js";
import getMedicalRecords from "../controllers/Public/getMedicalRecords.js";
import getServices from "../controllers/Public/getServices.js";
import getDoctors from "../controllers/Public/getDoctors.js"; 
import getMedPackages from "../controllers/Public/getMedPackages.js";
import getPaymnets from "../controllers/Public/getPayments.js";
import getOneRecord from "../controllers/Public/getOneMedRecord.js";
import getSinglePatient from "../controllers/Public/Patients/getSinglePatient.js";

const router = express.Router(); 
// Patients 
router.get('/patients', getAllPatients);
router.get("/patients/search", searchPatients);
router.get("/patients/single/:id", getSinglePatient);
//

// Services 
router.get('/services', getServices); 
//

// Medical records
router.get("/medicalrecords", getMedicalRecords);
router.get("/medicalrecords/single/:id", getOneRecord); // id of the medical record
//

// Doctors 
router.get('/doctors', getDoctors); 
//

// Med-Packages 
router.get('/packages', getMedPackages);
// 

// Payments 
router.get('/payments', getPaymnets); 
// 


export default router; 