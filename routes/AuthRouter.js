import express from "express";
import refreshToken from "../controllers/Auth/refreshToken.js"; 
import login from "../controllers/Auth/Login.js";
import createAdmin from "../controllers/Auth/createAdmin.js"; 
const router = express.Router(); 


router.post("/login", login); 
router.post("/create-admin", createAdmin); 
router.post('/refreshtoken', refreshToken);
export default router; 