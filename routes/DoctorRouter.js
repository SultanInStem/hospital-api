import express from "express"; 
const router = express.Router();
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import getAllPendingRecords from "../controllers/Doctor/medicalRecords/getAllPendingRecords.js";
import getOnePendingRecord from "../controllers/Doctor/medicalRecords/getOnePendingRecord.js";
import completeProcedure from "../controllers/Doctor/medicalRecords/completeProcedure.js";
// NOTES 
router.post('/note/create', makeNote); 
router.delete('/note/:id', deleteNote);


// Patients 
router.get("/medicalrecords/pending", getAllPendingRecords);
router.get("/medicalrecords/pending/:id", getOnePendingRecord);   
router.post("/medicalrecords/procedure/complete", completeProcedure);
router.post("/medicalrecords/procedure/reject");

export default router; 