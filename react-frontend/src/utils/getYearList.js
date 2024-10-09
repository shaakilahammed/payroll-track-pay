export default function getYearList() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;

  return [currentYear, previousYear];
}
