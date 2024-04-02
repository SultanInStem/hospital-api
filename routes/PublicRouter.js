import express from "express";
import getAllPatients from "../controllers/Common/getAllPatients.js"; 
import patientSearch from "../controllers/Common/patientSearch.js"; 
import getMedicalRecords from "../controllers/Common/getMedicalRecords.js";
const router = express.Router(); 

router.get('/patients', getAllPatients);
router.get("/patients/search", patientSearch);
router.get("/medicalrecords", getMedicalRecords); // ":id" is of the patient
export default router; 