import express from "express"; 
const router = express.Router();
import Auth from '../middleware/Auth.js'; 
import login from '../controllers/Doctor/Login.js'; 
import makeNote from "../controllers/Doctor/PatientsNotes/makeNote.js";
// GET REQUESTS 
//-------------

// POST REQUESTS
router.post('/login', login);
router.post('/note/create', Auth, makeNote); 
//--------------



export default router; 