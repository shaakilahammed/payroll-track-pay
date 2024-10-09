import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "./ProjectList.module.css";
import PropTypes from "prop-types";
import calculateDaysLeft from "../../../utils/calculateDaysLeft";
import { useDispatch } from "react-redux";
import { setProject } from "../../../features/project/projectSlice";
import { useDeleteProjectMutation } from "../../../features/project/projectApi";
import { useEffect } from "react";
import showToast from "../../UI/Toast";
import Swal from "sweetalert2";
const ProjectListData = ({ project }) => {
  const dispatch = useDispatch();
  const [deleteProject, { isError, error, isSuccess }] =
    useDeleteProjectMutation();
  const { id, name, start_date, due_date, budget, progress, employee_ids } =
    project;

  // const timeLeftContent = <span className={
  //   calculateDaysLeft(due_date, start_date) === 'Overdue'
  // }>{calculateDaysLeft(due_date, start_date)}</span>;

  const editHandler = () => {
    dispatch(setProject(project));
  };

  useEffect(() => {
    if (isError) showToast("error", error);
    if (isSuccess) showToast("success", "Project Deleted Successfully");
  }, [error, isError, isSuccess]);

  const deleteHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Employee has been deleted.',
        //   'success'
        // )
      }
    });
  };
  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectHeader}>
        <h3 className={styles.projectHeader_title}>{name}</h3>

        <div className={styles.actions}>
          <RiEdit2Line className={styles.icon1} onClick={editHandler} />
          <RiDeleteBinLine className={styles.icon2} onClick={deleteHandler} />
        </div>
      </div>

      <div className={styles.projectBody}>
        <div className={styles.progress}>
          <div className={styles.progressBarContainer}>
            <progress
              id="file"
              value={progress}
              max="100"
              className={styles.progressBar}
            >
              {progress}%
            </progress>
            <span className={styles.progressCount}>{progress}%</span>
          </div>
          <span className={styles.timeLeft}>
            {progress === 100 ? (
              <span className={styles.complete}>Completed</span>
            ) : (
              <span
                className={
                  calculateDaysLeft(due_date, start_date) === "Overdue"
                    ? styles.overdue
                    : ""
                }
              >
                {calculateDaysLeft(due_date, start_date)}
              </span>
            )}
          </span>
        </div>
        <span className={styles.budget}>Budget: ${budget}</span>

        <div className={styles.dateContainer}>
          <div className={styles.startDate}>
            <span>
              <FaCalendarAlt /> Start Date
            </span>
            <span className={styles.date}>{start_date}</span>
          </div>
          <div className={styles.endDate}>
            <span>
              <FaCalendarAlt /> Due Date
            </span>
            <span className={styles.date}>{due_date}</span>
          </div>
        </div>

        <div className={styles.assignEmployees}>
          <p className={styles.assignLabel}>Assign Employees:</p>
          <div className={styles.employeesList}>
            {employee_ids.length === 0 ? (
              <span className={styles.overdue}>No Employee assigned</span>
            ) : (
              employee_ids.map((item) => (
                <div key={item.value} className={styles.employee}>
                  {item.label}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
ProjectListData.propTypes = {
  project: PropTypes.shape(),
};
export default ProjectListData;
