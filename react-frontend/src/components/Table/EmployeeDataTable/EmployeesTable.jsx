import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import { useGetEmployeesQuery } from '../../../features/employee/employeeApi';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';
import EmployeeDataRow from './EmployeeDataRow';

import React from 'react';

const EmployeesTable = React.forwardRef((props, ref) => {
    const {
        data: employees,
        isLoading,
        isError,
        error,
    } = useGetEmployeesQuery();

    let content = null;
    if (isLoading) {
        content = <TableMessage colSpan={8} message="Loading...." />;
    }
    if (!isLoading && isError) {
        content = <TableMessage colSpan={8} message={error?.message} />;
    }

    if (!isLoading && !isError && employees?.data?.length === 0) {
        content = <TableMessage colSpan={8} message="No employee found!" />;
    }

    if (!isLoading && !isError && employees?.data?.length > 0) {
        content = employees?.data?.map((item, index) => (
            <EmployeeDataRow
                key={item.id}
                employee={{ sl: index + 1, ...item }}
            />
        ));
    }
    return (
        <div className={styles.printTableContainer} ref={ref}>
            <div className={`${styles.showOnPrint} ${styles.printHeader}`}>
                <img src={creatorsCityImage} alt="Payroll Track & Pay" />
            </div>
            <h1 className={styles.tableTitle}>Payroll Track & Pay</h1>
            <h3 className={`${styles.tableTitle} ${styles.address}`}>
                Vitogo Parade Lautoka City
            </h3>
            <h3 className={styles.tableTitle}>Employee Data</h3>
            <table className={`${styles.container}`}>
                <thead>
                    <tr>
                        <td>SL</td>
                        <td>Name</td>
                        <td>Phone</td>
                        <td>Email</td>
                        <td>Hour Rate</td>
                        <td>Loan</td>
                        <td>Due</td>
                        <td>Status</td>
                        <td className={styles.hideOnPrint}>Actions</td>
                    </tr>
                </thead>
                <tbody>{content}</tbody>
            </table>
        </div>
    );
});

EmployeesTable.displayName = 'Employees Table';

export default EmployeesTable;
