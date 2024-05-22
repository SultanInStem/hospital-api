import express from "express"; 
const router = express.Router(); 
import createPatient from '../controllers/Admin/patientManagement/createPatient.js'; 
import updatePatient from "../controllers/Admin/patientManagement/updatePatient.js";
import deletePatient from "../controllers/Admin/patientManagement/deletePatient.js";
import createMedicalRecord from "../controllers/Admin/patientManagement/createMedicalRecord.js";
import makeRefund from "../controllers/Admin/finanaceManagment/makeRefund.js";
import getPayments from "../controllers/Admin/finanaceManagment/getPayments.js";
import activateStationaryPatient from "../controllers/Admin/patientManagement/activateStaticPatient.js";


// Patients 
router.post("/patients/create", createPatient); 
router.delete("/patients/:id", deletePatient);
router.patch("/patients/:id", updatePatient);
router.patch("/patients/static/activate", activateStationaryPatient); 
//------------

// Medical records 
router.post("/medicalrecords/create", createMedicalRecord);

// Finance 
router.post("/finance/refund", makeRefund); 
router.get("/finance/payment-records", getPayments); 
// -------

export default router;