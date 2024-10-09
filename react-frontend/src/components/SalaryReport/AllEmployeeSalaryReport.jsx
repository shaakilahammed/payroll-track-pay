import { useRef, useState } from 'react';
import getCurrentDate from '../../utils/getCurrentDate';
import styles from './SalaryReport.module.css';
import getFirstDayOfCurrentMonth from '../../utils/getFirstDayOfCurrentMonth';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import SalaryReportOverallTable from '../Table/SalaryReport/SalaryReportOverallTable';
import { useGetSalaryReportMutation } from '../../features/salary/salaryApi';
const AllEmployeeSalaryReport = () => {
  const [
    getAttendanceReportOverall,
    { data: salaries, isLoading, isError, error, isSuccess },
  ] = useGetSalaryReportMutation();
  const [values, setvalues] = useState({
    start_date: getFirstDayOfCurrentMonth(),
    end_date: getCurrentDate(),
  });

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

    getAttendanceReportOverall({
      start_date: values.start_date,
      end_date: values.end_date,
    });
  };

  const dateChangeHandler = (e) => {
    setIsDateChange(true);
    if (e.target.name === 'end_date' && e.target.value > getCurrentDate()) {
      alert("Can't update future date");
      return;
    }
    if (e.target.name === 'end_date' && e.target.value < values.start_date) {
      alert('End date must be after start date');
      return;
    }
    if (e.target.name === 'start_date' && e.target.value > values.end_date) {
      alert('Start date must be before start date');
      return;
    }
    setvalues((values) => ({ ...values, [e.target.name]: e.target.value }));
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
              max={getCurrentDate()}
              min={values.start_date}
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={false}>
            Submit
          </button>
        </form>
      </div>
      {isLoading && <span>Loading...</span>}
      {!isLoading && isError && error?.message}
      {!isLoading && !isError && !isDateChange && isSuccess && (
        <>
          <div className={styles.header}>
            <h3>
              Salary Report ({`${values.start_date} to ${values.end_date}`})
            </h3>
            <Link to="#" className={styles.btn} onClick={handlePrint}>
              Print
            </Link>
          </div>
          <SalaryReportOverallTable
            salaries={salaries?.data?.report_data || []}
            startDate={salaries?.data?.start_date}
            endDate={salaries?.data?.end_date}
            ref={tableRef}
          />
        </>
      )}
    </>
  );
};

export default AllEmployeeSalaryReport;
