import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import inputStyles from './Input.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';

import {
  useEditAdministratorMutation,
  useGetAdministratorQuery,
} from '../../features/administrator/administratorApi';

const EditAdministratorModal = ({ isOpen, onClose, id }) => {
  const [editAdministrator, { isLoading, isError, error, isSuccess, reset }] =
    useEditAdministratorMutation();

  const {
    data: administrator,
    isSuccess: administratorSuccess,
    isLoading: administratorIsLoading,
  } = useGetAdministratorQuery(id);

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

  useEffect(() => {
    administratorSuccess &&
      setValues({
        name: administrator?.data?.name ?? '',
        email: administrator?.data?.email ?? '',
        mobile: administrator?.data?.mobile ?? '',
        super_admin: administrator?.data?.super_admin ?? false,
        password: '',
        confirmPassword: '',
      });
  }, [administratorSuccess, administrator]);

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
      editAdministrator({
        id,
        data: {
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          super_admin: values.super_admin,
        },
      });
      setConfirmPasswordError(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && isSuccess && administrator?.success) {
      //   showToast('success', 'Administrator added successfully!');
      onClose();
      reset();
      resetForm();
      setValidationErrors({
        email: [],
        mobile: [],
        password: [],
      });
    }
  }, [isLoading, administrator, isError, isSuccess, onClose, reset]);

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
          <h3>Update Administrator</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}

        {administratorIsLoading ? (
          <spane>Loading....</spane>
        ) : (
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
              <label>New Password</label>
              <input
                onChange={onChange}
                value={values.password}
                type="password"
                placeholder="Enter New Password"
                name="password"
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
              Update Administrator
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

EditAdministratorModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.any,
};

export default EditAdministratorModal;
