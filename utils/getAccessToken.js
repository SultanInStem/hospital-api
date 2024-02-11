const jwt = require("jsonwebtoken"); 

const accessToken = (load) => {
    return jwt.sign(load, process.env.JWT_ACCESS_KEY, {expiresIn: process.env.JWT_ACCESS_LIFE}); 
}
module.exports = accessToken; 