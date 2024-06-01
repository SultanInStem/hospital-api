import Patient from "../db/models/Patient.js";

const cleanPatients = async() => {
    try{
        // await Patient.deleteMany({}, );
        return {success: true}; 
    }catch(err){
        return {success: false, err: err}; 
    }
}
export default cleanPatients;