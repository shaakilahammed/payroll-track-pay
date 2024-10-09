import { useRef, useState } from 'react';
import { useGetActiveEmployeesQuery } from '../../features/employee/employeeApi';
import getCurrentDate from '../../utils/getCurrentDate';
import styles from './SalaryReport.module.css';
import getFirstDayOfCurrentMonth from '../../utils/getFirstDayOfCurrentMonth';
import { useGetAttendanceReportByEmployeeIdMutation } from '../../features/attendance/attendanceApi';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import SalaryReportSingleEmployeeTable from '../Table/SalaryReport/SalaryReportSingleEmployeeTable';

const SingleEmployeeSalaryReport = () => {
  const { data: employees } = useGetActiveEmployeesQuery();
  const [
    getAttendanceData,
    { data: attendances, isLoading, isError, error, isSuccess },
  ] = useGetAttendanceReportByEmployeeIdMutation();
  const [values, setvalues] = useState({
    start_date: getFirstDayOfCurrentMonth(),
    end_date: getCurrentDate(),
    employee_id: '',
  });

  const [employeeName, setEmployeeName] = useState('');

  const [isDateChange, setIsDateChange] = useState(true);

  let tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'salary-data',
    pageStyle: () => '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDateChange(false);

    getAttendanceData({
      start_date: values.start_date,
      end_date: values.end_date,
      employee_id: values.employee_id,
    });
  };

  const dateChangeHandler = (e) => {
    setIsDateChange(true);
    setvalues((values) => ({ ...values, [e.target.name]: e.target.value }));

    if (e.target.name === 'employee_id') {
      const selectedIndex = e.target.selectedIndex;
      const selectedText = e.target.options[selectedIndex].text;
      setEmployeeName(selectedText);
    }
  };
  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formInput}>
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={values.start_date}
              onChange={(e) => dateChangeHandler(e)}
              max={values.end_date}
              required
            />
          </div>
          <div className={styles.formInput}>
            <label>End Date:</label>
            <input
              type="date"
              value={values.end_date}
              name="end_date"
              onChange={(e) => dateChangeHandler(e)}
              // max={getCurrentDate()}
              min={values.start_date}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label>Select Employee:</label>
            <select
              value={values.employee_id}
              onChange={(e) => dateChangeHandler(e)}
              name="employee_id"
              required
            >
              <option value="">Select Employee</option>
              {employees?.data?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submit} disabled={false}>
            Submit
          </button>
        </form>
      </div>
      {isLoading && <span>Loading...</span>}
      {!isLoading && isError && <span>{error?.message}</span>}
      {!isLoading && !isError && !isDateChange && isSuccess && (
        <>
          <div className={styles.header}>
            <h3>
              Saalry Report ({`${values.start_date} to ${values.end_date}`})
            </h3>
            <Link to="#" className={styles.btn} onClick={handlePrint}>
              Print
            </Link>
          </div>
          <SalaryReportSingleEmployeeTable
            attendances={attendances?.data || []}
            startDate={values.start_date}
            endDate={values.end_date}
            employeeName={employeeName}
            ref={tableRef}
          />
        </>
      )}
    </>
  );
};

export default SingleEmployeeSalaryReport;
