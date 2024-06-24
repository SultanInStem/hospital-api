import express from "express"; 
const router = express.Router();
import getPatientsQueue from "../controllers/Doctor/queueFunctionality/getPatientsQueue.js";
import completeRecord from "../controllers/Doctor/medicalRecords/completeRecord.js";
import redirectForRefund from "../controllers/Doctor/medicalRecords/redirectForRefund.js";
import directToService from "../controllers/Doctor/InpatientsManagement/directToService.js";
import getDocsPatients from "../controllers/Doctor/allPatientsManagement/getDocsPatients.js";
import getAllNotes from "../controllers/Doctor/notes/getAllNotes.js";
import createNote from "../controllers/Doctor/notes/createNote.js";
import getDocsNotes from "../controllers/Doctor/notes/getDocsNotes.js";
import deleteNote from "../controllers/Doctor/notes/deleteNote.js";

// NOTES 
router.get('/notes/all/:id', getAllNotes);
router.get('/notes/specific/:id', getDocsNotes); 
router.post('/notes/create', createNote); 
router.delete('/notes/single/:id', deleteNote);


// All-Patients 
router.get("/patients/queue", getPatientsQueue); 
router.get("/patients", getDocsPatients); // get patients that are supervised by a certain doctor 
//


// Med Records 
router.patch("/medicalrecords/complete/:id", completeRecord); // complete med-record
router.patch("/medicalrecords/refund/:id", redirectForRefund); // redirect for a refund 
// router.post("/medicalrecords/create", directToService); // create med-record for the inpatient 
//


// Inpatients  
router.post("/inpatients/medicalrecords/create", directToService); // creates a med-record for the inpatient 
//
export default router; 