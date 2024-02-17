import mongoose from "mongoose";

const DocsCredentials = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId, 
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    }

})
const NotesSchema = new mongoose.Schema({
    diagnosis: {
        type: String, 
        default: ""
    },
    diagnosedBy: DocsCredentials,
    sidenote: {
        type: String,
        required: true,
    },

}, {timestamps: true}); 

const Note = mongoose.model('doctors-notes', NotesSchema); 

export default Note;