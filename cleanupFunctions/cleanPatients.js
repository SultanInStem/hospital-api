import Patient from "../db/models/Patient.js";
const TIME_INTERVAL = Number(process.env.DB_CLEANUP_INTERVAL); 

const cleanPatients = async() => {
    try{
        if(isNaN(TIME_INTERVAL)){
            return {success: false, err: 'time interval is not a number!'};
        }
        const currentUnix = new Date().getTime(); 
        const allPatients = await Patient.find();
        let count = 0;
        for(const patient of allPatients){
            if(currentUnix - patient.lastSeen > TIME_INTERVAL){
                await Patient.findByIdAndDelete(patient._id);
                count++; 
            }
        }
        return { success: true, deletedPatients: count }; 
    }catch(err){
        return {success: false, err: err}; 
    }
}
export default cleanPatients;