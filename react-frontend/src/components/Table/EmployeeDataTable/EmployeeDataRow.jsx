import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import styles from '../Table.module.css';
import PropTypes from 'prop-types';
import { setEmployee } from '../../../features/employee/employeeSlice';
import Swal from 'sweetalert2';
import { useDeleteEmployeeMutation } from '../../../features/employee/employeeApi';
import showToast from '../../UI/Toast';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const EmployeeDataRow = ({ employee }) => {
  const dispatch = useDispatch();
  const [deleteEmployee, { isError, error, isSuccess, isLoading }] =
    useDeleteEmployeeMutation();

  const {
    sl,
    id,
    name,
    email,
    mobile,
    address,
    hour_rate,
    loan_balance,
    unpaid_balance,
    active,
  } = employee;

  useEffect(() => {
    if (isError) showToast('error', error);
    if (isSuccess) showToast('success', 'Employee Deleted Successfully');
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
        deleteEmployee(id);
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
      setEmployee({
        id,
        name,
        email,
        mobile,
        address,
        hourRate: hour_rate,
        active,
      })
    );
  };

  return (
    <tr>
      <td>{sl}</td>
      <td>{name}</td>
      <td>{mobile}</td>
      <td>{email}</td>
      <td>${hour_rate}</td>
      <td>${loan_balance}</td>
      <td>${unpaid_balance}</td>
      <td>
        {/* <label className={`${styles.hideOnPrint} ${styles.switch}`}>
          <input
            type="checkbox"
            checked={active}
            onChange={handleToggleActive}
            disabled={toggleIsLoading}
          />
          <span className={styles.slider}></span>
        </label> */}
        {active ? (
          <span className={`${styles.backTransparent} super-badge`}>
            active
          </span>
        ) : (
          <span className={`${styles.backTransparent} user-badge`}>
            inactive
          </span>
        )}
      </td>
      <td className={`${styles.actions} ${styles.hideOnPrint}`}>
        {/* <button className={`${styles.iconButton} ${styles.info}`}>
          <RiEyeLine className={styles.icon} />
        </button> */}
        <button
          className={`${styles.iconButton} ${styles.edit}`}
          onClick={editHandler}
        >
          <RiEdit2Line className={styles.icon} />
        </button>
        <button
          className={`${styles.iconButton} ${styles.delete}`}
          onClick={deleteHandler}
          disabled={isLoading}
        >
          <RiDeleteBinLine className={styles.icon} />
        </button>
      </td>
    </tr>
  );
};

EmployeeDataRow.propTypes = {
  employee: PropTypes.shape(),
};

export default EmployeeDataRow;
