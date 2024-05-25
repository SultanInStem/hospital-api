const unixTimeToDays = (unixTime) => {
    if(unixTime < 0) return; 
    const secondsInADay = 86400; // 24 hours * 60 minutes * 60 seconds
    const days = Math.floor(unixTime / secondsInADay);
    return days;
}
export default unixTimeToDays;