import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
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
    awaitingServices: {
        type: [serviceSchema],
        required: true
    },
    finishedServices: {
        type: [String],
        required: true,
        default: []
    },
    toRefundServices: {
        type: [String],
        required: true,
        default: []
    },
    paymentSlip: {
        type: mongoose.Types.ObjectId,
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
        enum: ['pending', 'completed', 'toRefund'],
        default: "pending",
        index: true
    },
    allDoctorsInvolved: {
        type: Map,
        required: true
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 