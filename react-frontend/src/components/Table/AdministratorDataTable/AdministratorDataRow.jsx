import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import styles from '../Table.module.css';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import showToast from '../../UI/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setAdministrator } from '../../../features/administrator/administratorSlice';
import { useDeleteAdministratorMutation } from '../../../features/administrator/administratorApi';
import { useNavigate } from 'react-router-dom';

const AdministratorDataRow = ({ administrator }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticatedUserId = useSelector((state) => state?.auth?.user?.id);

  // isdisabled bad dewa hoise for user status
  const [deleteAdminitrator, { isError, error, isSuccess, isLoading }] =
    useDeleteAdministratorMutation();
  const { sl, id, name, email, mobile, super_admin } = administrator;

  useEffect(() => {
    if (isError) showToast('error', error);
    if (isSuccess) showToast('success', 'Administrator Deleted Successfully');
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
        deleteAdminitrator(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Employee has been deleted.',
        //   'success'
        // )
      }
    });
  };

  const editHandler = () => {
    if (authenticatedUserId === id) {
      navigate('/profile');
    } else {
      dispatch(
        setAdministrator({
          id,
          name,
          email,
          mobile,
          super_admin,
        })
      );
    }
  };
  return (
    <tr>
      <td>{sl}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{mobile}</td>
      <td>
        {super_admin ? (
          <span className="super-badge">Super Admin</span>
        ) : (
          <span className="user-badge">User</span>
        )}
      </td>
      <td className={`${styles.actions} ${styles.hideOnPrint}`}>
        <button
          className={`${styles.iconButton} ${styles.edit}`}
          onClick={editHandler}
        >
          <RiEdit2Line className={styles.icon} />
        </button>
        {!super_admin && (
          <button
            className={`${styles.iconButton} ${styles.delete}`}
            onClick={deleteHandler}
            disabled={isLoading}
          >
            <RiDeleteBinLine className={styles.icon} />
          </button>
        )}
      </td>
    </tr>
  );
};

AdministratorDataRow.propTypes = {
  administrator: PropTypes.shape(),
};

export default AdministratorDataRow;
