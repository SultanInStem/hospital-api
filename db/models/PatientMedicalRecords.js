import mongoose from "mongoose";
const procedureSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId, 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    providedBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})
const Schema = new mongoose.Schema({
    awaitingProcedures: {
        type: [procedureSchema],
        required: true
    },
    finishedProcedures: {
        type: [String],
        required: true,
        default: []
    },
    rejectedProcedures: {
        type: [String],
        required: true,
        default: []
    },
    totalPrice: {
        type: Number,
        required: true
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    patientFirstName: {
        type: String, 
        required: true
    },
    patientLastName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: "pending"
    },
    allDoctorsInvolved: {
        type: Map,
        required: true
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 