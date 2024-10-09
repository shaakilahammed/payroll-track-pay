import PropTypes from 'prop-types';
import React from 'react';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';

const AttendaceReportSingleEmployeeTable = React.forwardRef(
    ({ attendances, startDate, endDate, employeeName }, ref) => {
        return (
            <div className={styles.printTableContainer} ref={ref}>
                <div className={`${styles.showOnPrint} ${styles.printHeader}`}>
                    <img src={creatorsCityImage} alt="Payroll Track & Pay" />
                </div>
                <h1 className={styles.tableTitle}>Payroll Track & Pay</h1>
                <h3 className={`${styles.tableTitle} ${styles.address}`}>
                    Vitogo Parade Lautoka City
                </h3>
                <h2 className={styles.tableTitle}>Attendance Report</h2>
                <p className={styles.tableTitle}>Name - {employeeName}</p>
                <p className={styles.tableTitle}>Start Date - {startDate}</p>
                <p className={styles.tableTitle}>End Date - {endDate}</p>
                <table className={styles.container}>
                    <thead>
                        <tr>
                            <td>SL</td>
                            <td>Date</td>
                            <td>Sign In</td>
                            <td>Sign Out</td>
                            <td>Total Hour</td>
                            <td>Hour Rate</td>
                            <td>Amount</td>
                            <td>Is Paid</td>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.length > 0 ? (
                            attendances?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.sign_in ?? '-'}</td>
                                    <td>{item.sign_out ?? '-'}</td>
                                    <td>{item.total_hour}</td>
                                    <td>${item.hour_rate}</td>
                                    <td>${item.amount}</td>
                                    <td>
                                        {item.calculated ? (
                                            <span className="blue-badge">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="red-badge">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <TableMessage colSpan={8} message="No data found" />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
);

AttendaceReportSingleEmployeeTable.propTypes = {
    attendances: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    employeeName: PropTypes.string,
};

AttendaceReportSingleEmployeeTable.displayName =
    'Attendace Report Single Employee Table';

export default AttendaceReportSingleEmployeeTable;
