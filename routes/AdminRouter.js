import express from "express"; 
const router = express.Router(); 
import createDoctor from '../controllers/Admin/doctorManagement/createDoctor.js'; 
import getDoctors from '../controllers/Admin/doctorManagement/getDoctors.js'; 
import deleteDoctor from '../controllers/Admin/doctorManagement/deleteDoctor.js'; 
import createPatient from '../controllers/Admin/patientManagement/createPatient.js'; 
import patientSearch from "../controllers/Common/patientSearch.js";
import createService from "../controllers/Admin/serviceManagement/createService.js";
import addToQueueAfterPayment from "../controllers/Admin/patientManagement/addToQueueAfterPayment.js";
import getServices from "../controllers/Admin/serviceManagement/getServices.js";
import Auth from '../middleware/Auth.js'; 

// Docs
router.post('/create/doctor', Auth, createDoctor);
router.get('/doctors', Auth, getDoctors); 
router.delete('/doctor/:id', Auth, deleteDoctor); 
//-----------




// Patients 
router.post('/patients/create', Auth, createPatient); 
router.get("/patients/search", Auth, patientSearch);
router.post("/patients/queue/add", Auth, addToQueueAfterPayment);
//------------

// Services 
router.get('/services', Auth, getServices); 
router.post('/services/create', Auth, createService);
// --------

export default router;