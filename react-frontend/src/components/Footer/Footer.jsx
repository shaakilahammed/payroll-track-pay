import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>&copy;2023 | All right Reserved</span>
    </div>
  );
};

export default Footer;
