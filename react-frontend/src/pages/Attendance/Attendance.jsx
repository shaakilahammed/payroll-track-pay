import AttendanceFormTable from '../../components/Table/AttendanceFormTable/AttendanceFormTable';
import getCurrentDate from '../../utils/getCurrentDate';
import styles from './Attendance.module.css';

import { useState } from 'react';

const Attendance = () => {
  const [date, setDate] = useState(getCurrentDate());
  const handleDateChange = (e) => {
    if (e.target.value > getCurrentDate()) {
      alert("Can't update future attendances");
    } else {
      setDate(e.target.value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>Attendance</h2>
          <div className={styles.date}>
            <label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                max={getCurrentDate()}
                required
              />
            </label>
          </div>
        </div>
        <AttendanceFormTable date={date} />
      </div>
    </div>
  );
};

export default Attendance;
