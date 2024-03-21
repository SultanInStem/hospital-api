import express from "express"; 
const router = express.Router();
import Auth from '../middleware/Auth.js'; 
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
import deleteNote from "../controllers/Doctor/PatientsNotes/deleteNote.js";
import patientSearch from "../controllers/Common/patientSearch.js";

// NOTES 
router.post('/note/create', Auth, makeNote); 
router.delete('/note/:id', Auth, deleteNote);


// Patients 
router.get("/patients/search", Auth, patientSearch);

export default router; 