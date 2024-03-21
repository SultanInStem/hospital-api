import express from "express"; 
const router = express.Router(); 
import createDoctor from '../controllers/Admin/createDoctor.js'; 
import getDoctors from '../controllers/Admin/getDoctors.js'; 
import deleteDoctor from '../controllers/Admin/deleteDoctor.js'; 
import createPatient from '../controllers/Admin/createPatient.js'; 
import patientSearch from "../controllers/Common/patientSearch.js";
import Auth from '../middleware/Auth.js'; 

// Docs
router.post('/create/doctor', Auth, createDoctor);
router.get('/doctors', Auth, getDoctors); 
router.delete('/doctor/:id', Auth, deleteDoctor); 
//-----------




// Patients 
router.post('/patients/create', Auth, createPatient); 
router.get("/patients/search", Auth, patientSearch);
//------------



export default router;