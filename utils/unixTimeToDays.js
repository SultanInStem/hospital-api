const unixTimeToDays = (unixTime) => {
    if(unixTime < 0) return; 
    const msInADay = 86400000; // 24 hours * 60 minutes * 60 seconds * 1000 ms
    const days = Math.floor(unixTime / msInADay);
    return days;
}
export default unixTimeToDays;