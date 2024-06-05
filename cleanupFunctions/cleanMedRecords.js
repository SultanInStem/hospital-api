import PatientMedicalRecord from "../db/models/PatientMedicalRecords.js";
const TIME_INTERVAL = Number(process.env.DB_CLEANUP_INTERVAL); 
const cleanMedRecords = async() => {
    try{
        const currentUnix = new Date().getTime(); 
        const allRecords = await PatientMedicalRecord.find();
        let count = 0;
        for(const record of allRecords){
            if(currentUnix - record.createdAt > TIME_INTERVAL){
                await PatientMedicalRecord.findByIdAndDelete(record._id);
                count++; 
            }
        }
        return { success: true, deletedMedicalRecords: count }; 
    }catch(err){
        return { success: false, err }; 
    }
}
export default cleanMedRecords;