import React from 'react';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';

import PropTypes from 'prop-types';

const AttendanceReportOverallTable = React.forwardRef(
    ({ attendances, startDate, endDate }, ref) => {
        return (
            <div className={styles.printTableContainer} ref={ref}>
                <div
                    className={`${styles.showOnPrint} ${styles.printHeader} ${styles.printHeaderLarge}`}
                >
                    <img src={creatorsCityImage} alt="Payroll Track & Pay" />
                </div>
                <h1 className={styles.tableTitle}>Payroll Track & Pay</h1>
                <h3 className={`${styles.tableTitle} ${styles.address}`}>
                    Vitogo Parade Lautoka City
                </h3>
                <h2 className={styles.tableTitle}>Attendance Report</h2>
                <p className={styles.tableTitle}>Start Date - {startDate}</p>
                <p className={styles.tableTitle}>End Date - {endDate}</p>
                <table className={styles.container}>
                    <thead>
                        <tr>
                            <td>SL</td>
                            <td>Date</td>
                            <td>Total Present</td>
                            <td>Total Absent</td>
                            <td className={styles.total_work_hour}>
                                Total Work Hour
                            </td>
                            <td className={styles.total_gross}>
                                Total Gross Amount
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.length > 0 ? (
                            attendances?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.total_present ?? 0}</td>
                                    <td>{item.total_absent ?? 0}</td>
                                    <td>{item.total_hour ?? 0}</td>
                                    <td>${item.total_amount ?? 0}</td>
                                </tr>
                            ))
                        ) : (
                            <TableMessage colSpan={6} message="No data found" />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
);

AttendanceReportOverallTable.propTypes = {
    attendances: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
};
AttendanceReportOverallTable.displayName = 'Attendance Report Overall Table';
export default AttendanceReportOverallTable;
