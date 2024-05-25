import express from "express"; 
const router = express.Router();
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import getPatientsQueue from "../controllers/Doctor/queueFunctionality/getPatientsQueue.js";
import completeRecord from "../controllers/Doctor/medicalRecords/completeRecord.js";
import redirectForRefund from "../controllers/Doctor/medicalRecords/redirectForRefund.js";
import directToService from "../controllers/Doctor/staticPatientsManagement/directToService.js";


// NOTES 
router.post('/note/create', makeNote); 
router.delete('/note/:id', deleteNote);


// Patients 
router.get("/patients/queue", getPatientsQueue); 
router.patch("/patients/static/directToService", directToService); 
//

// Med Records 
router.patch("/medicalrecords/complete/:id", completeRecord); 
router.patch("/medicalrecords/refund/:id", redirectForRefund);
//
export default router; 