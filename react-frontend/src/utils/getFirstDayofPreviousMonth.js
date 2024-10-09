export default function getFirstDayOfPreviousMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based index

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  return `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-01`;
}
