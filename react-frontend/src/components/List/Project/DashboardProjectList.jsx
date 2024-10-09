import { FaCalendarAlt } from 'react-icons/fa';
import { useGetRunningProjectsDataQuery } from '../../../features/dashboard/dashboardApi';
import calculateDaysLeft from '../../../utils/calculateDaysLeft';
import styles from './ProjectList.module.css';
const DashboardProjectList = () => {
  const {
    data: projects,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetRunningProjectsDataQuery();
  let content = null;
  if (isLoading) {
    content = <span>Loading...</span>;
  }
  if (!isLoading && isError) {
    content = <span>{error?.message}</span>;
  }

  if (!isLoading && !isError && isSuccess && projects?.data?.length === 0) {
    content = <span>No project found</span>;
  }
  if (!isLoading && !isError && isSuccess && projects?.data?.length > 0) {
    content = projects?.data?.map((item) => (
      <div className={styles.projectContainer} key={item.id}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectHeader_title}>{item.name}</h3>
          <span className={styles.budget}>Budget: ${item.budget}</span>
        </div>

        <div className={styles.projectBody}>
          <div className={styles.progress}>
            <div
              className={`${styles.progressBarContainer} ${
                item.progress <= 50
                  ? styles.BlackProgressBar
                  : styles.WhiteProgressBar
              }`}
            >
              <progress
                id="file"
                value={item.progress}
                max="100"
                className={styles.progressBar}
              >
                {item.progress}%
              </progress>
              <span className={styles.progressCount}>{item.progress}%</span>
            </div>
            <span className={styles.timeLeft}>
              {item.progress === 100 ? (
                <span className={styles.complete}>Completed</span>
              ) : (
                <span
                  className={
                    calculateDaysLeft(item.due_date, item.start_date) ===
                    'Overdue'
                      ? styles.overdue
                      : ''
                  }
                >
                  {calculateDaysLeft(item.due_date, item.start_date)}
                </span>
              )}
            </span>
          </div>

          <div className={styles.dateContainer}>
            <div className={styles.startDate}>
              <span>
                <FaCalendarAlt /> Start Date
              </span>
              <span className={styles.date}>{item.start_date}</span>
            </div>
            <div className={styles.endDate}>
              <span>
                <FaCalendarAlt /> Due Date
              </span>
              <span className={styles.date}>{item.due_date}</span>
            </div>
          </div>

          <div className={styles.assignEmployees}>
            <p className={styles.assignLabel}>Assign Employees:</p>
            <div className={styles.employeesList}>
              {item.employee_ids.length === 0 ? (
                <span className={styles.overdue}>No Employee assigned</span>
              ) : (
                item.employee_ids.map((item) => (
                  <div key={item.value} className={styles.employee}>
                    {item.label}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  }
  return <div className={styles.container}>{content}</div>;
};

export default DashboardProjectList;
