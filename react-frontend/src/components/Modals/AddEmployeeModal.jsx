import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import Input from './Input';
import inputStyles from './Input.module.css';
import PropTypes from 'prop-types';
import { useAddEmployeeMutation } from '../../features/employee/employeeApi';
import showToast from '../UI/Toast';
const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [addEmployee, { isLoading, isError, error, isSuccess, reset }] =
    useAddEmployeeMutation();
  const [values, setValues] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    hourRate: '',
    active: true,
  });

  const inputs = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      placeholder: 'Full Name',
      errorMessage: 'Name is required!',
      label: 'Name',
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      errorMessage: 'It should be a valid email address!',
      label: 'Email',
      required: true,
    },
    // {
    //   id: 3,
    //   name: 'birthday',
    //   type: 'date',
    //   placeholder: 'Birthday',
    //   label: 'Birthday',
    // },
    {
      id: 3,
      name: 'address',
      type: 'text',
      placeholder: 'Address',
      errorMessage: 'Address is required',
      label: 'Address',
      required: true,
    },
    {
      id: 4,
      name: 'Phone',
      type: 'text',
      placeholder: 'Phone Number',
      errorMessage: 'Phone Number required',
      label: 'Phone Number',
      // pattern: '^01[0-9]{9}$',
      required: true,
    },
    {
      id: 5,
      name: 'hourRate',
      type: 'number',
      placeholder: 'Hour Rate',
      errorMessage: 'Hour rate is required',
      label: 'Hour Rate',
      required: true,
    },
  ];

  const resetForm = () => {
    setValues({
      name: '',
      email: '',
      address: '',
      mobile: '',
      hourRate: '',
      active: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addEmployee({
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      address: values.address,
      hour_rate: values.hourRate,
      active: values.active,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      showToast('success', 'Employee added successfully!');
      onClose();
      reset();
      resetForm();
    }
  }, [isSuccess, onClose, isLoading, reset]);

  const onChange = (e) => {
    if (e.target.name === 'active') {
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
          <h3>Add Employee</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {isError && <span className="error">{error?.message}</span>}
        <form onSubmit={handleSubmit} className={styles.form}>
          {inputs.map((input) => (
            <Input
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
          <div className={`${inputStyles.formInput} ${inputStyles.checkbox}`}>
            <input
              onChange={onChange}
              checked={values.active}
              type="checkbox"
              name="active"
              id="active"
            />
            <label htmlFor="active">Active</label>
          </div>
          <button type="submit" disabled={isLoading}>
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

AddEmployeeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddEmployeeModal;
