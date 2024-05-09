import mongoose from "mongoose";
const ManagerSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: String
    }
}, {timestamps: true})


const Manager = mongoose.model('manager', ManagerSchema); 

export default Manager; 