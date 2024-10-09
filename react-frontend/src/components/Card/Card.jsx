import styles from './Card.module.css';
import PropTypes from 'prop-types';

const Card = ({ number, name, icon }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.number}>{number}</div>
        <div className={styles.cardName}>{name}</div>
      </div>
      <div className={styles.icon}>{icon}</div>
    </div>
  );
};

Card.propTypes = {
  number: PropTypes.any,
  name: PropTypes.string,
  icon: PropTypes.any,
};

export default Card;
