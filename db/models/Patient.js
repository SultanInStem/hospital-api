import mongoose from "mongoose"; 
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
        required: true,
        enum: ['Male', 'Female']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\+\d{5}-\d{3}-\d{2}-\d{2}$/,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    uniqueId: {
        type: String,
        unique: true,
        required: true
    },
    notes: {
        type: Array,
        default: []
    },
    servicesToGet: {
        type: [mongoose.Types.ObjectId],
        default: []
    }
}, {timestamps: true})

const Patient = mongoose.model('patients', PatientSchema); 
export default Patient;