import express from "express";
import createService from "../controllers/Manager/serviceManagement/createService.js"; 
import createAdmin from "../controllers/Manager/adminManagement/createAdmin.js"; 
import updateService from "../controllers/Manager/serviceManagement/updateService.js";
import deleteService from "../controllers/Manager/serviceManagement/deleteService.js";
const router = express.Router(); 

// Create admin account 
router.post('/create-admin', createAdmin); 

// Services 
router.post('/service', createService);
router.patch('/service/:id', updateService); 
router.delete('/service/:id', deleteService); 

//

export default router;
