// import { StatusCodes } from "http-status-codes";
// import User from "../../db/models/User.js";

// const getAllDoctors = async(req,res,next) => {
//     try{
//         const { limit } = req.query; 
//         let doctors = []; 
//         if(Number(limit)){
//             doctors = await User.find({role: 'Doctor'}).limit(limit); 
//         }
//         return res.status(StatusCodes.OK).json({success: true}); 
//     }catch(err){
//         return next(err); 
//     }
// }
// export default getAllDoctors;