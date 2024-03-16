import express from "express"; 
const router = express.Router(); 
import createDoctor from '../controllers/Admin/createDoctor.js'; 
import getDoctors from '../controllers/Admin/getDoctors.js'; 
import deleteDoctor from '../controllers/Admin/deleteDoctor.js'; 
import createPatient from '../controllers/Admin/createPatient.js'; 
import Auth from '../middleware/Auth.js'; 

// POST REQUESTS  
router.post('/create/doctor', Auth, createDoctor);
router.post('/create/patient', Auth, createPatient); 
//----------- 

// GET REQUESTS 
router.get('/doctors', Auth, getDoctors); 
router.get('/', (req,res) => res.send('Admin here'))
//------------


// DELETE REQUESTS 
router.delete('/doctor/:id', Auth, deleteDoctor); 
//----------------
export default router;