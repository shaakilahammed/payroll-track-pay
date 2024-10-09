import styles from './Dashboard.module.css';
import CardList from '../../components/Card/CardList';
import BarChart from '../../components/Charts/BarCharts';
import Table from '../../components/Table/Table';
// import DashboardProjectList from '../../components/List/Project/DashboardProjectList';
import { useLazySendMailTodayQuery } from '../../features/dashboard/dashboardApi';
import { useEffect } from 'react';
import showToast from '../../components/UI/Toast';
const Dashboard = () => {
  const [sendMail, { isLoading, isError, isSuccess }] =
    useLazySendMailTodayQuery();
  const handleSendUpdate = () => {
    sendMail();
  };
  useEffect(() => {
    if (!isLoading && isError) {
      showToast('error', 'Something went wrong!');
    }
    if (!isLoading && !isError && isSuccess) {
      showToast('success', "Today's update sent successfully!");
    }
  }, [isLoading, isError, isSuccess]);
  return (
    <div className={styles.container}>
      <div className={styles.sendButtonContainer}>
        <button
          className={styles.sendButton}
          onClick={handleSendUpdate}
          disabled={isLoading}
        >
          Send Update
        </button>
      </div>
      <CardList />
      <div className={styles.charts}>
        <h2>Employee Count This Month</h2>
        <BarChart />
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <h2 className={styles.header_title}>Working Employees</h2>
          {/* <Link href="#" className={styles.btn}>
            View all
          </Link> */}
        </div>
        <Table />
      </div>

      {/* <div className={`${styles.table} ${styles.cards}`}>
        <div className={styles.header}>
          <h2 className={styles.header_title}>Running Project</h2>
          <Link href="#" className={styles.btn}>
            View all
          </Link>
        </div>
        <DashboardProjectList />
      </div> */}
    </div>
  );
};

export default Dashboard;
