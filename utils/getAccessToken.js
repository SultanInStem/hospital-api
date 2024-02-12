import jwt from "jsonwebtoken";

const accessToken = (load) => {
    return jwt.sign(load, process.env.JWT_ACCESS_KEY, {expiresIn: process.env.JWT_ACCESS_LIFE}); 
}
export default accessToken;