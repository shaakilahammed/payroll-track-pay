import styles from './Navbar.module.css';

import { BiCalendar, BiNotepad } from 'react-icons/bi';
import { BsPersonCheck } from 'react-icons/bs';
import { FaDollarSign } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';
import {
    IoIosLogOut,
    IoIosPeople,
    IoIosSettings,
    IoIosStats,
    IoMdHome,
} from 'react-icons/io';

import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/authApi';
import useAuth from '../../hooks/useAuth';
import logo from './../../assets/logo.png';

const menus = [
    // {
    //   title: 'Payroll Track & Pay',
    //   link: '#',
    //   icon: <Logo />,
    //   role: 'user',
    // },
    {
        title: 'Dashboard',
        link: '/dashboard',
        icon: <IoMdHome />,
        role: 'user',
    },
    {
        title: 'Employees',
        link: '/employees',
        icon: <IoIosPeople />,
        role: 'user',
    },
    {
        title: 'Attendance',
        link: '/attendances',
        icon: <BsPersonCheck />,
        role: 'user',
    },
    {
        title: 'Loans',
        link: '/loans',
        icon: <GiReceiveMoney />,
        role: 'super_admin',
    },
    {
        title: 'Salary Disburse',
        link: '/salaries',
        icon: <FaDollarSign />,
        role: 'super_admin',
    },
    {
        title: 'Payment History',
        link: '/payment-history',
        icon: <IoIosStats />,
        role: 'super_admin',
    },
    {
        title: 'Attendance Report',
        link: '/attendance-report',
        icon: <BiCalendar />,
        role: 'super_admin',
    },
    {
        title: 'Salary Report',
        link: '/salary-report',
        icon: <BiNotepad />,
        role: 'super_admin',
    },
    // {
    //   title: 'Projects',
    //   link: '/projects',
    //   icon: <BsPCircle />,
    //   role: 'user',
    // },
    {
        title: 'Settings',
        link: '/settings',
        icon: <IoIosSettings />,
        role: 'super_admin',
    },
    // {
    //   title: 'Admins',
    //   link: '/admin',
    //   icon: <BsKeyFill />,
    // },
];

const Navbar = ({ shortMenu }) => {
    const { pathname } = useLocation();
    const [logout] = useLogoutMutation();

    const userRole = useAuth();

    const logOutHandler = () => {
        logout();
    };

    const filteredMenus = menus.filter(
        (item) => item.role === 'user' || item.role === userRole
    );

    return (
        <div
            className={`${styles.container} ${
                shortMenu ? styles.shortMenu : styles.notShortMenu
            }`}
        >
            <ul className={styles.menu}>
                <li className={`${styles.menuItem}`}>
                    <Link to="/dashboard" className={styles.menuLinkContainer}>
                        <span className={styles.menuLink}>
                            <span className={styles.icon}>
                                <img src={logo} alt="Payroll Track & Pay" />
                            </span>
                            <span
                                className={`${styles.shopTitle} ${styles.title}`}
                            >
                                Payroll Track
                                <br />& Pay
                            </span>
                        </span>
                    </Link>
                </li>
                {filteredMenus.map((item, index) => (
                    <li
                        className={`${styles.menuItem} ${
                            pathname.startsWith(item.link) && styles.active
                        }`}
                        key={index}
                    >
                        <Link to={item.link} className={styles.menuLink}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.title}>{item.title}</span>
                        </Link>
                    </li>
                ))}
                <li className={`${styles.menuItem}`}>
                    <span className={styles.menuLink} onClick={logOutHandler}>
                        <span className={styles.icon}>
                            <IoIosLogOut />
                        </span>
                        <span className={styles.title}>Sign Out</span>
                    </span>
                </li>
            </ul>
        </div>
    );
};

Navbar.propTypes = {
    shortMenu: PropTypes.bool,
};

export default Navbar;
