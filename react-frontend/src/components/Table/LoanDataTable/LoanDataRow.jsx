import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import styles from '../Table.module.css';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import showToast from '../../UI/Toast';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useDeleteLoanMutation } from '../../../features/loan/loanApi';
import { setLoan } from '../../../features/loan/loanSlice';

const LoanDataRow = ({ loan }) => {
  const dispatch = useDispatch();
  const [deleteLoan, { isError, error, isSuccess, isLoading }] =
    useDeleteLoanMutation();
  const { sl, id, amount, date, employee, calculated } = loan;

  useEffect(() => {
    if (isError) showToast('error', error);
    if (isSuccess) showToast('success', 'Loan Deleted Successfully');
  }, [error, isError, isSuccess]);

  const deleteHandler = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLoan(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Employee has been deleted.',
        //   'success'
        // )
      }
    });
  };

  const editHandler = () => {
    dispatch(
      setLoan({
        id,
        employee_id: employee.id,
        amount,
        date,
      })
    );
  };
  return (
    <tr>
      <td>{sl}</td>
      <td>{employee.name}</td>
      <td>${amount}</td>
      <td>{date}</td>
      <td className={styles.actions}>
        {calculated ? (
          <span className={`super-badge ${styles.backTransparent}`}>
            cleared
          </span>
        ) : (
          <>
            <button
              className={`${styles.iconButton} ${styles.hideOnPrint} ${styles.edit}`}
              onClick={editHandler}
            >
              <RiEdit2Line className={styles.icon} />
            </button>
            <button
              className={`${styles.iconButton} ${styles.hideOnPrint} ${styles.delete}`}
              onClick={deleteHandler}
              disabled={isLoading}
            >
              <RiDeleteBinLine className={styles.icon} />
            </button>
            <span
              className={`user-badge ${styles.showOnPrint} ${styles.backTransparent}`}
            >
              pending
            </span>
          </>
        )}
      </td>
    </tr>
  );
};

LoanDataRow.propTypes = {
  loan: PropTypes.shape(),
};

export default LoanDataRow;
