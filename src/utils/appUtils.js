export const formatDate = (normalDate) => {
  const date = new Date(normalDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
  // console.log(formattedDate); // Output: "07-10-2024"
};

export const isDateLessThanToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate < today;
};

export const handleWordExceeded = (text, limit) => {
  let error = true;
  const excludeWords = new Set(['is', 'a', 'in', 'as', 'of', 'an', 'to', 'on', 'at', 'my', 'i', 'us']);
  const words = text
    .toLowerCase() // Convert to lowercase
    .match(/\b\w+\b/g); // Extract words using regex
  const filteredWords = words ? words.filter(word => !excludeWords.has(word)) : [];

  // Check if words exceed 50
  if (filteredWords.length > limit) {
    error = true;
  } else {
    error = false;
  }
  return error
}

export const addYears = (oldDate, yearsToAdd) => {
  const currentDate = new Date(oldDate); // Get the current date
  currentDate.setFullYear(currentDate.getFullYear() + yearsToAdd); // Add the years
  return currentDate; // Return the updated date
}

export const addDays = (oldDate, daysToAdd = 14) => {
  const currentDate = new Date(oldDate); // Get the current date
  currentDate.setDate(currentDate.getDate() + daysToAdd); // Add the days
  return currentDate; // Return the updated date
}