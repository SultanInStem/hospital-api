import express from "express"; 
const router = express.Router(); 
import createDoctor from '../controllers/Admin/doctorManagement/createDoctor.js'; 
import getDoctors from '../controllers/Admin/doctorManagement/getDoctors.js'; 
import deleteDoctor from '../controllers/Admin/doctorManagement/deleteDoctor.js'; 
import createPatient from '../controllers/Admin/patientManagement/createPatient.js'; 
import updateDoctor from "../controllers/Admin/doctorManagement/updateDoctor.js";
import createService from "../controllers/Admin/serviceManagement/createService.js";
import deleteService from "../controllers/Admin/serviceManagement/deleteService.js";
import getServices from "../controllers/Admin/serviceManagement/getServices.js";
import updateService from "../controllers/Admin/serviceManagement/updateService.js";
import updatePatient from "../controllers/Admin/patientManagement/updatePatient.js";
import deletePatient from "../controllers/Admin/patientManagement/deletePatient.js";
import createMedicalRecord from "../controllers/Admin/patientManagement/createMedicalRecord.js";
import getMedicalRecords from "../controllers/Admin/patientManagement/getMedicalRecords.js";
// Docs
router.post('/doctors/create', createDoctor);
router.get('/doctors', getDoctors);  
router.delete('/doctors/:id', deleteDoctor); 
router.patch("/doctors/:id", updateDoctor);
//-----------




// Patients 
router.post("/patients/create", createPatient); 
router.delete("/patients/:id", deletePatient);
router.patch("/patients/:id", updatePatient);
//------------

// Medical records 
router.post("/medicalrecords/create", createMedicalRecord);
router.get("/medicalrecords", getMedicalRecords);

// Services 
router.get('/services', getServices); 
router.post('/services/create', createService);
router.delete("/services/:id", deleteService); 
router.patch("/services/:id", updateService);
// --------

export default router;