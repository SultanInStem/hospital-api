const jwt = require('jsonwebtoken'); 
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY); 
}
module.exports = verifyAccessToken; 