import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import inputStyles from './Input.module.css';
import PropTypes from 'prop-types';
import { useGetActiveEmployeesQuery } from '../../features/employee/employeeApi';
import showToast from '../UI/Toast';
import Select from 'react-select';
import { useAddProjectMutation } from '../../features/project/projectApi';
const AddProjectModal = ({ isOpen, onClose }) => {
  const { data: employees, isSuccess: employeeSuccess } =
    useGetActiveEmployeesQuery();
  const [optionList, setOptionList] = useState([]);
  const [addProject, { isLoading, isError, error, isSuccess, reset }] =
    useAddProjectMutation();
  const [values, setValues] = useState({
    name: '',
    start_date: '',
    due_date: '',
    budget: '',
    progress: '',
    employee_ids: [],
  });

  const resetForm = () => {
    setValues({
      name: '',
      start_date: '',
      due_date: '',
      budget: '',
      progress: '',
      employee_ids: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject(values);
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      showToast('success', 'Project added successfully!');
      onClose();
      reset();
      resetForm();
    }
    if (employeeSuccess) {
      setOptionList(() =>
        employees?.data?.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }
  }, [isSuccess, onClose, isLoading, reset, employeeSuccess, employees]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleEmployeeSelect = (data) => {
    setValues({ ...values, employee_ids: data });
  };
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add Project</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={inputStyles.formInput}>
            <label>Project Name</label>
            <input
              onChange={onChange}
              value={values.name}
              type="text"
              placeholder="Enter Project Name"
              name="name"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Start Date</label>
            <input
              onChange={onChange}
              value={values.start_date}
              max={values.due_date}
              type="date"
              placeholder="Enter Date"
              name="start_date"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>End Date</label>
            <input
              onChange={onChange}
              value={values.due_date}
              min={values.start_date}
              type="date"
              placeholder="Enter Date"
              name="due_date"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Budget</label>
            <input
              onChange={onChange}
              value={values.budget}
              type="number"
              min="1"
              placeholder="Enter Budget Amount"
              name="budget"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Progress</label>
            <input
              onChange={onChange}
              value={values.progress}
              type="number"
              min="0"
              max="100"
              placeholder="Enter Progress Value"
              name="progress"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Select Employee</label>
            <Select
              options={optionList}
              value={values.employee_ids}
              onChange={handleEmployeeSelect}
              isSearchable={true}
              isMulti
            />
          </div>

          <button type="submit" disabled={isLoading}>
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

AddProjectModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddProjectModal;
