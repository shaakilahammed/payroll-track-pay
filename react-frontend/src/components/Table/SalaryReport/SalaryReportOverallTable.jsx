import React from 'react';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';

import PropTypes from 'prop-types';

const SalaryReportOverallTable = React.forwardRef(
    ({ salaries, startDate, endDate }, ref) => {
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
                <h2 className={styles.tableTitle}>Salary Report</h2>
                <p className={styles.tableTitle}>Start Date - {startDate}</p>
                <p className={styles.tableTitle}>End Date - {endDate}</p>
                <table className={styles.container}>
                    <thead>
                        <tr>
                            <td>SL</td>
                            <td>Name</td>
                            <td className={styles.total_work_hour}>
                                Total Work Hour
                            </td>
                            <td>Total Loan</td>
                            <td className={styles.total_work_hour}>
                                Total Gross Payment
                            </td>
                            <td>Total Payment</td>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.length > 0 ? (
                            salaries?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.employee_name}</td>
                                    <td>{item.total_hour ?? 0}</td>
                                    <td>${item.total_loan ?? 0}</td>
                                    <td>{item.total_gross_payment ?? 0}</td>
                                    <td>${item.total_payment ?? 0}</td>
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

SalaryReportOverallTable.propTypes = {
    salaries: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
};
SalaryReportOverallTable.displayName = 'Attendance Report Overall Table';
export default SalaryReportOverallTable;
