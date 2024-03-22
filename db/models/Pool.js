import mongoose from "mongoose";


const PatientInQueue = new mongoose.Schema({
    patientId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    servicesToGet: {
        type: Array,
        required: true
    }
}, {timestamps: true})
const PoolSchema = new mongoose.Schema({
    patientQueue: {
        type: [PatientInQueue]
    }
})

const Pool = mongoose.model("Pool", PoolSchema); 

export default Pool; 


