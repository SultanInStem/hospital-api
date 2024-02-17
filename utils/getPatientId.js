const getPatientId = (patient) => {
    const { firstName, lastName, phoneNumber } = patient;
    const str = Buffer.from(firstName + lastName + phoneNumber).toString('base64');  
    return str; 
}
export default getPatientId; 