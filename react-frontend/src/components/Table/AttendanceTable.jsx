
import styles from './Table.module.css';

const AttendanceTable = () => {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <td>SL</td>
          <td>Employee ID</td>
          <td>Name</td>
          <td>Sign in</td>
          <td>Sign out</td>
          <td>Total</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>4556</td>
          <td>Sabbir Mahmud</td>
          <td>9:36AM</td>
          <td>3:00PM</td>
          <td>6.25</td>
        </tr>
        <tr>
          <td>2</td>
          <td>4556</td>
          <td>Sabbir Mahmud</td>
          <td>9:36AM</td>
          <td>3:00PM</td>
          <td>6.25</td>
        </tr>
      </tbody>
    </table>
  );
};

export default AttendanceTable;
