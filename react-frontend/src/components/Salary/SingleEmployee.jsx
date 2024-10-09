import { useState } from 'react';
import styles from './Salary.module.css';
import getFirstDayOfPreviousMonth from '../../utils/getFirstDayofPreviousMonth';
import getCurrentDate from '../../utils/getCurrentDate';
import { useGetSalaryDataByEmployeeIdMutation } from '../../features/salary/salaryApi';
import { useGetActiveEmployeesQuery } from '../../features/employee/employeeApi';
import SalarySingleEmployeeTable from '../Table/SalaryFormTable/SalarySingleEmployeeTable';

const SingleEmployee = () => {
  const { data: employees } = useGetActiveEmployeesQuery();
  const [
    getSalaryData,
    { data: salaries, isLoading, isError, error, isSuccess },
  ] = useGetSalaryDataByEmployeeIdMutation();
  const [values, setvalues] = useState({
    start_date: getFirstDayOfPreviousMonth(),
    end_date: getCurrentDate(),
    employee_id: '',
  });

  const [isDateChange, setIsDateChange] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDateChange(false);

    getSalaryData({
      id: values.employee_id,
      data: { start_date: values.start_date, end_date: values.end_date },
    });
  };

  const dateChangeHandler = (e) => {
    setIsDateChange(true);
    if (e.target.name === 'end_date' && e.target.value > getCurrentDate()) {
      alert("Can't update future salary");
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

          <button type="submit" className={styles.submit} disabled={isLoading}>
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
              Salary Data ({`${values.start_date} to ${values.end_date}`})
            </h3>
          </div>
          <SalarySingleEmployeeTable
            salaries={salaries?.data || {}}
            startDate={values.start_date}
            endDate={values.end_date}
          />
        </>
      )}
    </>
  );
};

export default SingleEmployee;
