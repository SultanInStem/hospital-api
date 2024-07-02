import express from "express"; 
const router = express.Router();
import VerifyPCP from "../middleware/VerifyPCP.js";
import getPatientsQueue from "../controllers/Doctor/queueFunctionality/getPatientsQueue.js";
import completeRecord from "../controllers/Doctor/medicalRecords/completeRecord.js";
import redirectForRefund from "../controllers/Doctor/medicalRecords/redirectForRefund.js";
import directToService from "../controllers/Doctor/InpatientsManagement/directToService.js";
import getAllNotes from "../controllers/Doctor/notes/getAllNotes.js";
import createNote from "../controllers/Doctor/notes/createNote.js";
import getDocsNotes from "../controllers/Doctor/notes/getDocsNotes.js";
import deleteNote from "../controllers/Doctor/notes/deleteNote.js";
import getDocsPatients from "../controllers/Doctor/PCP_Actions/getDocsPatients.js";
import updateCurrentCondition from "../controllers/Doctor/PCP_Actions/updateCurrentCondition.js";
import updateMedicalHistory from "../controllers/Doctor/PCP_Actions/updateMedicalHistory.js";
import updateNeuroCondition from "../controllers/Doctor/PCP_Actions/updateNeuroCondition.js";
import updateStatusLocalis from "../controllers/Doctor/PCP_Actions/updateStatusLocalis.js";
import updateMainDiagnosis from "../controllers/Doctor/PCP_Actions/updateMainDiagnosis.js";
import updateEpidemicHistory from "../controllers/Doctor/PCP_Actions/updateEpidemicHistory.js";
import updateComplaints from "../controllers/Doctor/PCP_Actions/updateComplaints.js";
// NOTES 
router.get('/notes/all/:id', getAllNotes);
router.get('/notes/specific/:id', getDocsNotes); 
router.post('/notes/create', createNote); 
router.delete('/notes/single/:id', deleteNote);


// All-Patients 
router.get("/patients/queue", getPatientsQueue); 
//

// Med Records 
router.patch("/medicalrecords/complete/:id", completeRecord); // complete med-record
router.patch("/medicalrecords/refund/:id", redirectForRefund); // redirect for a refund 


// Inpatients  
router.post("/inpatients/medicalrecords/create", directToService); // creates a med-record for the inpatient 
//


// PCP ACTIONS 
router.get("/patients/pcp", getDocsPatients);
router.patch("/patients/pcp/condition", VerifyPCP, updateCurrentCondition);
router.patch("/patients/pcp/localis", VerifyPCP, updateStatusLocalis);
router.patch("/patients/pcp/neurocondition", VerifyPCP, updateNeuroCondition);
router.patch("/patients/pcp/history", VerifyPCP, updateMedicalHistory);
router.patch("/patients/pcp/epidemichistory", VerifyPCP, updateEpidemicHistory);
router.patch("/patients/pcp/complaints", VerifyPCP, updateComplaints);
router.patch("/patients/pcp/diagnosis", VerifyPCP, updateMainDiagnosis);



//
export default router; 