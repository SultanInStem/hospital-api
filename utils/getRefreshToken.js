const jwt = require('jsonwebtoken'); 

const refreshToken = (load) => {
    return jwt.sign(load, process.env.JWT_REFRESH_KEY, {expiresIn: process.env.JWT_REFRESH_LIFE}); 
}
module.exports = refreshToken; 