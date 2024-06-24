import mongoose from "mongoose"; 
import { phonePattern } from "../../utils/constants.js";
const PatientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: phonePattern,
    },
    dateOfBirth: {
        type: Date
    },
    uniqueId: {
        type: String,
        unique: true,
        required: true
    },
    complaints: {
        type: String
    },
    expiresAt: {
        type: Number,
        default: 0
    }, 
    packages: {
        type: [mongoose.Types.ObjectId],
        default: []
    }, 
    PCP: { // primary care physician 
        type: mongoose.Types.ObjectId
    },
    lastSeen: {
        type: Number, 
        required: true
    }
}, {timestamps: true})

const Patient = mongoose.model('patients', PatientSchema); 
export default Patient;