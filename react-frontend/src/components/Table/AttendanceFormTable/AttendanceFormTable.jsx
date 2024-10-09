import styles from './AttendanceFormTable.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import calculateTotalTime from '../../../utils/calculateTotalTime';
import {
  useAddAttendanceMutation,
  useGetAttendanceMutation,
} from '../../../features/attendance/attendanceApi';
import TableMessage from '../../UI/TableMessage';
import showToast from '../../UI/Toast';
import PropTypes from 'prop-types';

const AttendanceFormTable = ({ date }) => {
  const [getAttendance, { data, isLoading, isSuccess, isError, error }] =
    useGetAttendanceMutation();
  const [addAttendance, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddAttendanceMutation();
  const [attendanceData, setAttendanceData] = useState([]);

  const handleDateTimeChange = (e, rowIndex, field) => {
    setAttendanceData((prevData) => {
      const updatedData = [...prevData];
      const sign_inTime =
        field === 'sign_in' ? e.target.value : updatedData[rowIndex]['sign_in'];
      const sign_outTime =
        field === 'sign_out'
          ? e.target.value
          : updatedData[rowIndex]['sign_out'];

      const total_hour = calculateTotalTime(sign_inTime, sign_outTime);

      if (total_hour >= 0) {
        updatedData[rowIndex][field] = e.target.value;
        if (sign_inTime && sign_outTime) {
          updatedData[rowIndex]['total_hour'] = total_hour;
        } else {
          updatedData[rowIndex]['total_hour'] = 0;
        }
      }
      return updatedData;
    });
  };
  const handleSwitchChange = (e, rowIndex) => {
    const isChecked = e.target.checked;
    setAttendanceData((prevData) => {
      const updatedData = [...prevData];
      const updatedItem = { ...updatedData[rowIndex] };
      updatedItem.present = isChecked;
      if (isChecked) {
        updatedItem.sign_in = '08:00';
        updatedItem.sign_out = '16:00';
        updatedItem.total_hour = 8;
      } else {
        updatedItem.present = false;
        updatedItem.sign_in = '';
        updatedItem.sign_out = '';
        updatedItem.total_hour = 0;
      }
      updatedData[rowIndex] = updatedItem; // Replace the item in the copied array
      return updatedData; // Return the updated copy
    });
  };

  const handleSubmit = () => {
    // console.log('Submitting attendance data:', date);
    if (date) addAttendance(attendanceData);
    else showToast('error', 'Date is required');
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const updatedAttendanceData = data.data.map((item) => ({
        ...item,
        date: item.date || date,
        present: item.present || false,
        sign_in: item.sign_in ? item.sign_in : '',
        sign_out: item.sign_out ? item.sign_out : '',
      }));
      setAttendanceData(updatedAttendanceData);
    }
  }, [data, isLoading, isSuccess, date]);

  useEffect(() => {
    getAttendance(date);
    if (addSuccess) showToast('success', 'Attendance updated successfully!');
  }, [date, addSuccess, getAttendance]);

  let content = null;
  if (isLoading) {
    content = <TableMessage colSpan={6} message="Loading...." />;
  }
  if (!isLoading && isError) {
    content = <TableMessage colSpan={6} message={error?.message} />;
  }

  if (!isLoading && !isError && data?.data?.length === 0) {
    content = <TableMessage colSpan={7} message="No Attendance data found!" />;
  }

  if (!isLoading && !isError && data?.data?.length > 0) {
    content = attendanceData.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td className={styles.employeename}>{item.name}</td>
        <td>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={item.present}
              onChange={(e) => handleSwitchChange(e, index)}
              disabled={item.calculated}
            />
            <span className={styles.slider}></span>
          </label>
        </td>
        <td>
          <label className={styles.time}>
            <input
              type="time"
              key={`sign_in_${index}`}
              disabled={!item.present || item.calculated}
              value={item.sign_in}
              onChange={(e) => handleDateTimeChange(e, index, 'sign_in')}
            />
          </label>
        </td>
        <td>
          <label className={styles.time}>
            <input
              type="time"
              key={`sign_out_${index}`}
              disabled={!item.present || item.calculated}
              value={item.sign_out}
              onChange={(e) => handleDateTimeChange(e, index, 'sign_out')}
            />
          </label>
        </td>

        <td>{item.total_hour ? item.total_hour : 0} hours</td>
        <td>
          {item.calculated ? (
            <span className="blue-badge">Paid</span>
          ) : (
            <span className="red-badge">Unpaid</span>
          )}
        </td>
      </tr>
    ));
  }

  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <td>SL</td>
            <td>Name</td>
            <td>Present</td>
            <td>Sign in</td>
            <td>Sign out</td>
            <td className={styles.width100}>Total</td>
            <td>isPaid</td>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
      {!isLoading && !isError && (
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={addLoading}
        >
          Submit
        </button>
      )}
    </>
  );
};

AttendanceFormTable.propTypes = {
  date: PropTypes.string,
};

export default AttendanceFormTable;
