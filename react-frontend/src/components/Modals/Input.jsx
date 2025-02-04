import styles from './Input.module.css';
import { useState } from 'react';

const Input = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className={styles.formInput}>
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        // onFocus={() =>
        //   inputProps.name === 'confirmPassword' && setFocused(true)
        // }
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default Input;
