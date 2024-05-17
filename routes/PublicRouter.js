import express from "express";
import getAllPatients from "../controllers/Public/getAllPatients.js"; 
import patientSearch from "../controllers/Public/patientSearch.js"; 
import getMedicalRecords from "../controllers/Public/getMedicalRecords.js";
import getServices from "../controllers/Public/getServices.js";
import getDoctors from "../controllers/Public/getDoctors.js"; 
import getMedPackages from "../controllers/Public/getMedPackages.js";
const router = express.Router(); 
// Patients 
router.get('/patients', getAllPatients);
router.get("/patients/search", patientSearch);
//

// Services 
router.get('/services', getServices); 
//

// Medical records
router.get("/medicalrecords", getMedicalRecords); // ":id" is of the patient
//

// Doctors 
router.get('/doctors', getDoctors); 
//


router.get('/packages', getMedPackages);
export default router; 