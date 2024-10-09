export default function getMonthList() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index
  //   const currentYear = currentDate.getFullYear();

  const previousMonths = [];
  for (let i = currentMonth; i >= 0; i--) {
    previousMonths.push({ month: months[i], serial: i + 1 });
  }

  return previousMonths;
}

// Call the function to get the array of previous months
// const previousMonthsArray = getMonthList();
// console.log(previousMonthsArray);
