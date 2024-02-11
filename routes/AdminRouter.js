const express = require("express"); 
const router = express.Router(); 
const createAdmin = require('../controllers/Admin/createAdmin'); 
const login = require('../controllers/Admin/Login'); 
const Auth = require('../middleware/Auth'); 
router.get('/', (req,res) => res.send('Admin here'))
router.post('/create', Auth, createAdmin);
router.post('/login', login); 
module.exports = router; 