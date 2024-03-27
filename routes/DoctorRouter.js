import express from "express"; 
const router = express.Router();
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import getAllPendingRecords from "../controllers/Doctor/medicalRecords/getAllPendingRecords.js";
// NOTES 
router.post('/note/create', makeNote); 
router.delete('/note/:id', deleteNote);


// Patients 
router.get("/medicalrecords/pending", getAllPendingRecords);  


export default router; 