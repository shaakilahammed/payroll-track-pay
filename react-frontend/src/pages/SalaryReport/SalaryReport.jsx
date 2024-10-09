import styles from './SalaryReport.module.css';
import { useState } from 'react';
import SingleEmployeeSalaryReport from '../../components/SalaryReport/SingleEmployeeSalaryReport';
import AllEmployeeSalaryReport from '../../components/SalaryReport/AllEmployeeSalaryReport';

const SalaryReport = () => {
  const [isSingleEmployee, setIsSingleEmployee] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>Salary Report</h2>
          {/* <button
            className={styles.toggleButton}
            onClick={() => setIsSingleEmployee(!isSingleEmployee)}
          >
            {isSingleEmployee ? 'All Employee' : 'Single Employee'}
          </button> */}
        </div>
        {isSingleEmployee ? (
          <SingleEmployeeSalaryReport />
        ) : (
          <AllEmployeeSalaryReport />
        )}
      </div>
    </div>
  );
};

export default SalaryReport;
