import express from "express"; 
const router = express.Router();
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import getPatientsQueue from "../controllers/Doctor/queueFunctionality/getPatientsQueue.js";
// NOTES 
router.post('/note/create', makeNote); 
router.delete('/note/:id', deleteNote);


// Patients 
router.get("/patients/queue", getPatientsQueue); 

// router.get("/medicalrecords/pending", getAllPendingRecords);
// router.get("/medicalrecords/pending/:id", getOnePendingRecord);   
// router.post("/medicalrecords/procedure/complete", completeProcedure);
// router.post("/medicalrecords/procedure/reject", rejectProcedure);

export default router; 