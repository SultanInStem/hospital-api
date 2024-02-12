// FIX THIS BS
import bcrypt from "bcryptjs"; 
import { nanoid, customAlphabet } from "nanoid";
const getPatientId = async (seed, length) => {
    const hash = await bcrypt.hash(seed); 
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const customId = customAlphabet(alphabet, length);
    return customId(hash); 
}
export default getPatientId; 