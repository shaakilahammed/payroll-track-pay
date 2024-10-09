import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import inputStyles from './Input.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import {
  useEditLoanMutation,
  useGetLoanQuery,
} from '../../features/loan/loanApi';
import { useGetActiveEmployeesQuery } from '../../features/employee/employeeApi';
import getCurrentDate from '../../utils/getCurrentDate';
import getFirstDayOfPreviousMonth from '../../utils/getFirstDayofPreviousMonth';

const EditLoanModal = ({ isOpen, onClose, id }) => {
  const { data: employees } = useGetActiveEmployeesQuery();

  const [editLoan, { isLoading, isError, error, isSuccess, reset }] =
    useEditLoanMutation();

  const {
    data: loan,
    isSuccess: loanSuccess,
    isLoading: loanIsLoading,
  } = useGetLoanQuery(id);

  const [values, setValues] = useState({
    employee_id: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    loanSuccess &&
      setValues({
        employee_id: loan?.data?.employee_id ?? '',
        amount: loan?.data?.amount ?? '',
        date: loan?.data?.date ?? getCurrentDate(),
      });
  }, [loanSuccess, loan]);

  const resetForm = () => {
    setValues({
      employee_id: '',
      amount: '',
      date: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    editLoan({
      id,
      data: {
        employee_id: values.employee_id,
        amount: values.amount,
        date: values.date,
      },
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      // showToast('success', 'Employee added successfully!');
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
          <h3>Update Loan</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}

        {loanIsLoading ? (
          <spane>Loading....</spane>
        ) : (
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
              Update Loan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

EditLoanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.any,
};

export default EditLoanModal;
