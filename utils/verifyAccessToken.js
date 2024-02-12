import jwt from "jsonwebtoken";
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY); 
}
export default verifyAccessToken;