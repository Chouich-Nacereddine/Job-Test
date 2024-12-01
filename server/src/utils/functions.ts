
// this is a function that return the start date and current date to filter data
export const filter = (param: any): { startDate: Date; currentDate: Date } => {
    // this is the 'days' query parameter that will be set to 1 year '365 days' if not provided
    const period = parseInt(param as string) || 365; // the default value is 1 year = 365 days
  
    /** this is returning the current date so that we start counting from it 
    ex: if we select 7 days in the frontend, the data concerned will be the last 7 days data counting from the current day  */
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // this will set HH:MM:SS to 00:00:00 because I see in the database that hours, minutes, and seconds are ignored
  
    // this is calculating the start date by subtracting the period (in days) from the current date
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - period);
    // console.log("Start Date:", startDate);
    // console.log("Current Date:", currentDate);
    return { startDate, currentDate };
  };
  