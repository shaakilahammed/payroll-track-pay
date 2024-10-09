import AllEmployee from '../../components/Salary/AllEmployee';
import SingleEmployee from '../../components/Salary/SingleEmployee';
import styles from './Salary.module.css';
import { useState } from 'react';

const Salary = () => {
  const [isSingleEmployee, setIsSingleEmployee] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2 className={styles.salary_title}>Salary Disbursement</h2>
          <button
            className={styles.toggleButton}
            onClick={() => setIsSingleEmployee(!isSingleEmployee)}
          >
            {isSingleEmployee ? 'All Employee' : 'Single Employee'}
          </button>
        </div>
        {isSingleEmployee ? <SingleEmployee /> : <AllEmployee />}
      </div>
    </div>
  );
};

export default Salary;
