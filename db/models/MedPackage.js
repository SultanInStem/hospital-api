import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
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