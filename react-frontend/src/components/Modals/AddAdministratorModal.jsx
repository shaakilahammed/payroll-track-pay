import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import inputStyles from './Input.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import showToast from '../UI/Toast';
import { useAddAdministratorMutation } from '../../features/administrator/administratorApi';
const AddAdministratorModal = ({ isOpen, onClose }) => {
  const [
    addAdministrator,
    { data: administrator, isLoading, isError, error, isSuccess, reset },
  ] = useAddAdministratorMutation();

  const [values, setValues] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    super_admin: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    email: [],
    mobile: [],
    password: [],
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const resetForm = () => {
    setValues({
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      super_admin: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      addAdministrator({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        super_admin: values.super_admin,
      });
      setConfirmPasswordError(false);
    }
  };

  useEffect(() => {
    if (!isError && isSuccess && administrator?.success) {
      showToast('success', 'Administrator added successfully!');
      onClose();
      reset();
      resetForm();
      setValidationErrors({
        email: [],
        mobile: [],
        password: [],
      });
    }
  }, [administrator, isError, isSuccess, onClose, reset]);

  useEffect(() => {
    if (isError && !isSuccess && !error?.data?.success) {
      const { email, mobile, password } = error?.data?.errors || {};
      setValidationErrors({
        email: email || [],
        mobile: mobile || [],
        password: password || [],
      });
      // console.log(error?.data);
    }
  }, [error, isError, isSuccess]);

  const onChange = (e) => {
    if (e.target.name === 'super_admin') {
      setValues({ ...values, [e.target.name]: e.target.checked });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add Administrator</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={inputStyles.formInput}>
            <label>Full Name</label>
            <input
              onChange={onChange}
              value={values.name}
              type="text"
              placeholder="Enter Full Name"
              name="name"
              required
            />
          </div>
          <div className={inputStyles.formInput}>
            <label>Email</label>
            <input
              onChange={onChange}
              value={values.email}
              type="email"
              placeholder="Enter Email"
              name="email"
              required
            />
            {validationErrors?.email?.length > 0 && (
              <div className="error">{validationErrors?.email[0]}</div>
            )}
          </div>

          <div className={inputStyles.formInput}>
            <label>Mobile</label>
            <input
              onChange={onChange}
              value={values.mobile}
              type="text"
              placeholder="Enter Mobile Number"
              name="mobile"
              required
            />
            {validationErrors?.mobile?.length > 0 && (
              <div className="error">{validationErrors?.mobile[0]}</div>
            )}
          </div>

          <div className={inputStyles.formInput}>
            <label>Password</label>
            <input
              onChange={onChange}
              value={values.password}
              type="password"
              placeholder="Enter New Password"
              name="password"
              required
            />
            {validationErrors?.password?.length > 0 && (
              <div className="error">{validationErrors?.password[0]}</div>
            )}
          </div>

          <div className={inputStyles.formInput}>
            <label>Confirm New Password</label>
            <input
              onChange={onChange}
              value={values.confirmPassword}
              type="password"
              placeholder="Confirm New Password"
              name="confirmPassword"
              required
            />
            {confirmPasswordError && (
              <div className="error">
                Password & Confirm Password do not match!
              </div>
            )}
          </div>
          <div className={`${inputStyles.formInput} ${inputStyles.checkbox}`}>
            <input
              onChange={onChange}
              checked={values.super_admin}
              type="checkbox"
              name="super_admin"
              id="super_admin"
            />
            <label htmlFor="super_admin">Super Admin</label>
          </div>
          <button type="submit" disabled={isLoading}>
            Add Administrator
          </button>
        </form>
      </div>
    </div>
  );
};

AddAdministratorModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddAdministratorModal;
