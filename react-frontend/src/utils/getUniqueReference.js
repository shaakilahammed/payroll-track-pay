export default function getUniqueReference(startDate, endDate) {
  const currentDate = new Date();
  const datePart = currentDate.toISOString().split('T')[0];
  const timePart = currentDate.toTimeString().split(' ')[0];

  // Formatting the start and end dates
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const startDay = formattedStartDate.getDate();
  const startMonth = formattedStartDate.toLocaleString('default', {
    month: 'long',
  });
  const startYear = formattedStartDate.getFullYear();

  const endDay = formattedEndDate.getDate();
  const endMonth = formattedEndDate.toLocaleString('default', {
    month: 'long',
  });
  const endYear = formattedEndDate.getFullYear();

  return `${startDay}-${startMonth}-${startYear}-to-${endDay}-${endMonth}-${endYear}|${datePart}-${timePart}`;
}
