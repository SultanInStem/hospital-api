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
import getAllCards from "../controllers/Admin/bonusCard/getAllCards.js";
import makeInpatientRefund from "../controllers/Admin/finanaceManagment/makeInpatientRefund.js";

// Patients 
router.post("/patients/create", createPatient); 
router.delete("/patients/single/:id", deletePatient);
router.patch("/patients", updatePatient);
router.patch("/patients/activate/inpatient", activateInpatient); 
//------------

// Medical records 
router.post("/medicalrecords/create", createMedicalRecord);
// 

// Finance 
router.patch("/finance/refund/:id", makeRefund); 
router.patch("/finance/inpatient/refund/:id", makeInpatientRefund);
// ------- 

router.get('/bonuscards', getAllCards);
router.get('/bonuscards/single/:id', getCard);
router.post('/bonuscards', createCard);
router.delete('/bonuscards/single/:id', deleteCard);



export default router;