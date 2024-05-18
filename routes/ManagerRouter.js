import express from "express";
import createService from "../controllers/Manager/serviceManagement/createService.js"; 
import createAdmin from "../controllers/Manager/adminManagement/createAdmin.js"; 
import updateService from "../controllers/Manager/serviceManagement/updateService.js";
import deleteService from "../controllers/Manager/serviceManagement/deleteService.js";
import createDoctor from "../controllers/Manager/doctorManagement/createDoctor.js"; 
import deleteDoctor from "../controllers/Manager/doctorManagement/deleteDoctor.js"; 
import createMedPackage from "../controllers/Manager/packageManagement/createPackage.js";
import deletePackage from "../controllers/Manager/packageManagement/deletePackage.js";
import deleteAdmin from "../controllers/Manager/adminManagement/deleteAdmin.js";
import getAllAdmins from "../controllers/Manager/adminManagement/getAllAdmins.js";
import searchAdmin from "../controllers/Manager/adminManagement/searchAdmin.js";
const router = express.Router(); 

// Create admin account 
router.post('/admins', createAdmin); 
router.delete('/admins/:id', deleteAdmin); 
router.get('/admins', getAllAdmins);
router.get('/admins/search', searchAdmin); 
// 


// Services 
router.post('/service', createService);
router.patch('/service/:id', updateService); 
router.delete('/service/:id', deleteService); 
//

// Doctors
router.post('/doctor', createDoctor); 
router.delete('/doctor/:id', deleteDoctor); 
//

// Med Packages for stationary patients 
router.post('/package', createMedPackage);
router.delete('/package/:id', deletePackage); 
//

export default router;
