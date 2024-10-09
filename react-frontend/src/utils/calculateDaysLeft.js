export default function calculateDaysLeft(dueDate, startDate) {
  const dueDateObj = new Date(dueDate);
  const startDateObj = new Date(startDate);
  const currentDate = new Date();

  if (currentDate < startDateObj) {
    return 'Not started';
  } else if (currentDate > dueDateObj) {
    return 'Overdue';
  } else {
    const timeDiff = dueDateObj - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft + ' days left';
  }
}
