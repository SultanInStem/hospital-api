import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true 
    },
    servicesAllowed: {
        type: [mongoose.Types.ObjectId],
        required: true
    }
}); 

const MedPackage = mongoose.model('MedPackages', PackageSchema); 

export default MedPackage;