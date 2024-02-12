import express from "express"; 
const router = express.Router();
import Auth from '../middleware/Auth.js'; 
import login from '../controllers/Doctor/Login.js'; 

// GET REQUESTS 
//-------------

// POST REQUESTS
router.post('/login', login);
//--------------

export default router; 