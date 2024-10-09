export default function getMonthName(serial) {
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

  if (serial >= 1 && serial <= 12) {
    return months[serial - 1];
  } else {
    return 'Invalid Month';
  }
}
