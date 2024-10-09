import styles from './AttendanceReport.module.css';
import SingleEmployeeAttendanceReport from '../../components/AttendanceReport/SingleEmployeeAttendanceReport';
import AllEmployeeAttendanceReport from '../../components/AttendanceReport/AllEmployeeAttendanceReport';
import { useState } from 'react';

const AttendanceReport = () => {
  const [isSingleEmployee, setIsSingleEmployee] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>Attendance Report</h2>
          <button
            className={styles.toggleButton}
            onClick={() => setIsSingleEmployee(!isSingleEmployee)}
          >
            {isSingleEmployee ? 'All Employee' : 'Single Employee'}
          </button>
        </div>
        {isSingleEmployee ? (
          <SingleEmployeeAttendanceReport />
        ) : (
          <AllEmployeeAttendanceReport />
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
