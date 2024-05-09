import express from "express";
import refreshToken from "../controllers/Auth/refreshToken.js"; 
import login from "../controllers/Auth/Login.js";
import createManager from "../controllers/Auth/createManager.js";
const router = express.Router(); 


router.post("/login", login); 
router.post("/create-manager", createManager); 
router.post('/refreshtoken', refreshToken);
export default router; 