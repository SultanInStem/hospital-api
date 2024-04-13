import jwt from "jsonwebtoken";
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY); 
}
export default verifyRefreshToken;