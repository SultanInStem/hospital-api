import express from "express"; 
import login from "../controllers/Auth/Login.js";
import createAdmin from "../controllers/Admin/createAdmin.js"; 
const router = express.Router(); 


router.post("/login", login); 
router.post("/create-admin", createAdmin); 

export default router; 