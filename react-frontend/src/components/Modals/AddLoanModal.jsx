import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import inputStyles from './Input.module.css';
import PropTypes from 'prop-types';
import { useGetActiveEmployeesQuery } from '../../features/employee/employeeApi';
import showToast from '../UI/Toast';
import { useAddLoanMutation } from '../../features/loan/loanApi';
import getCurrentDate from '../../utils/getCurrentDate';
import getFirstDayOfPreviousMonth from '../../utils/getFirstDayofPreviousMonth';
const AddLoanModal = ({ isOpen, onClose }) => {
  const { data: employees } = useGetActiveEmployeesQuery();
  const [addLoan, { isLoading, isError, error, isSuccess, reset }] =
    useAddLoanMutation();
  const [values, setValues] = useState({
    amount: '',
    employee_id: '',
    date: getCurrentDate(),
  });

  const resetForm = () => {
    setValues({
      amount: '',
      employee_id: '',
      date: getCurrentDate(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addLoan({
      employee_id: values.employee_id,
      amount: values.amount,
      date: values.date,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      showToast('success', 'Loan added successfully!');
      onClose();
      reset();
      resetForm();
    }
  }, [isSuccess, onClose, isLoading, reset]);

  const onChange = (e) => {
    if (e.target.name === 'date' && e.target.value > getCurrentDate()) {
      alert("Can't update future loan");
      return;
    }
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add Loan</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={inputStyles.formInput}>
            <label>Date</label>
            <input
              onChange={onChange}
              value={values.date}
              max={getCurrentDate()}
              min={getFirstDayOfPreviousMonth()}
              type="date"
              placeholder="Enter Date"
              name="date"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Select Employee</label>
            <select
              value={values.employee_id}
              onChange={onChange}
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
          <div className={inputStyles.formInput}>
            <label>Amount</label>
            <input
              onChange={onChange}
              value={values.amount}
              type="number"
              min="1"
              placeholder="Enter Loan Amount"
              name="amount"
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            Add Loan
          </button>
        </form>
      </div>
    </div>
  );
};

AddLoanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddLoanModal;
