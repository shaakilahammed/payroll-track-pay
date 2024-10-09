export default function getFirstDayOfCurrentMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based index

  return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`;
}
