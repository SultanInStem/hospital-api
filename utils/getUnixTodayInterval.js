const getInterval = () => {
  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);  
  endOfToday.setHours(23, 59, 59, 999);  

  const start = Math.floor(startOfToday.getTime());
  const end = Math.floor(endOfToday.getTime());

  return {start, end}
}

export default getInterval;