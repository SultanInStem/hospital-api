const jwt = require('jsonwebtoken'); 
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY); 
}
module.exports = verifyRefreshToken; 