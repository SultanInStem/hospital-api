import express from "express"; 
const router = express.Router(); 
import createPatient from '../controllers/Admin/patientManagement/createPatient.js'; 
import updatePatient from "../controllers/Admin/patientManagement/updatePatient.js";
import deletePatient from "../controllers/Admin/patientManagement/deletePatient.js";
import createMedicalRecord from "../controllers/Admin/patientManagement/createMedicalRecord.js";
import makeRefund from "../controllers/Admin/finanaceManagment/makeRefund.js";
import createCard from "../controllers/Admin/bonusCard/createCard.js";
import deleteCard from "../controllers/Admin/bonusCard/deleteCard.js";
import activateInpatient from "../controllers/Admin/patientManagement/activateInpatient.js";
import getCard from "../controllers/Admin/bonusCard/getCard.js";


// Patients 
router.post("/patients/create", createPatient); 
router.delete("/patients/:id", deletePatient);
router.patch("/patients", updatePatient);
router.patch("/patients/activate/inpatient", activateInpatient); 
//------------

// Medical records 
router.post("/medicalrecords/create", createMedicalRecord);
// 

// Finance 
router.patch("/finance/refund/:id", makeRefund); 
// ------- 

router.get('/bonuscard/:id', getCard);
router.post('/bonuscard', createCard);
router.delete('/bonuscard/:id', deleteCard);


export default router;