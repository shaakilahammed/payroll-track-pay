import PropTypes from 'prop-types';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import userImage from '../../assets/user.png';
import styles from './Header.module.css';

const Header = ({ toggleShortMenu }) => {
    return (
        <div className={styles.container}>
            <div className={styles.toggle} onClick={toggleShortMenu}>
                <IoMdMenu />
            </div>
            {/* <div className={styles.dashboard_pos}>
        <a href="https://crshop.net/">
          <button className={styles.dashboardButton}>Dashboard</button>
        </a>
        <a href="https://crshop.net/pos">
          <button className={styles.posButton}>POS</button>
        </a>
      </div> */}
            <Link to="/profile">
                <div className={styles.user}>
                    <img
                        src={userImage}
                        alt="User"
                        className={styles.userImage}
                    />
                    {/* <div className={styles.userInfo}>
            <span className={styles.name}>Admin</span>
          </div> */}
                </div>
            </Link>
        </div>
    );
};

Header.propTypes = {
    toggleShortMenu: PropTypes.func,
};

export default Header;
