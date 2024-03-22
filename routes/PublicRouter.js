import express from "express";
import getAllPatients from "../controllers/Common/getAllPatients.js"; 
import patientSearch from "../controllers/Common/patientSearch.js"; 
const router = express.Router(); 

router.get('/patients', getAllPatients);
router.get("/patients/search", patientSearch);

export default router; 