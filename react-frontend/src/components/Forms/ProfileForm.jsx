import { useEffect, useState } from 'react';
import styles from './ProfileForm.module.css';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../../features/auth/authApi';
import showToast from '../UI/Toast';
const ProfileForm = () => {
  const {
    data: profile,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetProfileQuery();
  const [
    updateProfile,
    {
      data: updateProfileData,
      isLoading: updateLoading,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateProfileMutation();
  const [values, setValues] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: [],
    mobile: [],
    password: [],
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setValues({
        name: profile?.data?.name || '',
        email: profile?.data?.email || '',
        mobile: profile?.data?.mobile || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isSuccess, profile]);

  useEffect(() => {
    if (!updateIsError && updateIsSuccess && updateProfileData?.success) {
      showToast('success', 'Profile update successfully!');
    }

    if (!updateProfileData?.success) {
      console.log(updateProfileData?.errors);
      const { email, mobile, password } = updateProfileData?.errors || {};
      setValidationErrors({
        email: email || [],
        mobile: mobile || [],
        password: password || [],
      });
    }
  }, [updateIsSuccess, updateError, updateIsError, updateProfileData]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      updateProfile({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password:
          values.password === values.confirmPassword
            ? values.password
            : undefined,
      });
      setConfirmPasswordError(false);
    }
  };

  return (
    <div className={styles.container}>
      {!isLoading && isError && <span className="error">{error?.message}</span>}
      {!isLoading && !isError && isSuccess && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formInput}>
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
          <div className={styles.formInput}>
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

          <div className={styles.formInput}>
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

          <div className={styles.formInput}>
            <label>Password</label>
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

          <div className={styles.formInput}>
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

          <button type="submit" disabled={updateLoading}>
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
