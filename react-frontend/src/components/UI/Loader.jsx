import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.main}>
      <svg className={styles.container}>
        <circle cx="70" cy="70" r="70"></circle>
      </svg>
    </div>
  );
};

export default Loader;
