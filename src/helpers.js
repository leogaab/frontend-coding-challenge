// Helper function
export const daysBetweenDates = (date1, date2) => { 
  const difference = date1.getTime() - date2.getTime()
  const days = Math.ceil(difference / (1000 * 3600 * 24));
  console.log(days)
  return days
}