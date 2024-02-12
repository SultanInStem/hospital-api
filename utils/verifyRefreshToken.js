import jwt from "jsonwebtoken";
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY); 
}
export default verifyRefreshToken;