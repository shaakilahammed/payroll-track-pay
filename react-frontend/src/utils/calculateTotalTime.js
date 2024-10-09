export default function calculateTotalTime(signInTime = 0, signOutTime = 0) {
  // Convert time strings to Date objects
  const signInDate = new Date(`2000-01-01T${signInTime}`);
  const signOutDate = new Date(`2000-01-01T${signOutTime}`);

  // Calculate time difference in milliseconds
  let timeDiff = signOutDate - signInDate;

  // Convert time difference to hours with two decimal places
  const totalHours = (timeDiff / 1000 / 60 / 60).toFixed(2);

  return parseFloat(totalHours);
}
