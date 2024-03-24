import express from "express"; 
const router = express.Router();
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import getQueue from "../controllers/Doctor/NetQueue/getQueue.js";
// NOTES 
router.post('/note/create', makeNote); 
router.delete('/note/:id', deleteNote);


// Patients 
router.get("/patients/queue", getQueue);  


export default router; 