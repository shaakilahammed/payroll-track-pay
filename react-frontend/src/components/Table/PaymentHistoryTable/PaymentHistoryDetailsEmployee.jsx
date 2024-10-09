import React from 'react';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import { useGetPaymentHistoryByReferenceEmployeeIdQuery } from '../../../features/salary/salaryApi';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';

import PropTypes from 'prop-types';

const PaymentHistoryDetailsEmployee = React.forwardRef(
    ({ reference, employeeId, setDate, setName }, ref) => {
        const {
            data: salaryList,
            isError,
            isSuccess,
            isLoading,
            error,
        } = useGetPaymentHistoryByReferenceEmployeeIdQuery({
            reference,
            employeeId,
        });
        let content = null;
        if (isLoading) {
            content = <TableMessage colSpan={7} message="Loading...." />;
        }

        if (!isLoading && isError) {
            content = <TableMessage colSpan={7} message={error?.message} />;
        }

        if (
            !isLoading &&
            !isError &&
            isSuccess &&
            salaryList?.data?.salary_data?.length === 0
        ) {
            content = (
                <TableMessage colSpan={7} message="No Payment Data found!" />
            );
        }

        if (
            !isLoading &&
            !isError &&
            isSuccess &&
            salaryList?.data?.salary_data?.length > 0
        ) {
            setDate(salaryList?.data?.payment_date);
            setName(salaryList?.data?.employee_name);
            content = (
                <>
                    {salaryList?.data?.salary_data?.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.date}</td>
                            <td>{item.sign_in}</td>
                            <td>{item.sign_out}</td>
                            <td>{item.total_hour}</td>
                            <td>${item.hour_rate}</td>
                            <td>${item.amount}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="7"></td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Total Hours:
                        </td>
                        <td className="center">
                            {salaryList?.data?.total_hour}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Hour Rates:
                        </td>
                        <td className="center">
                            {salaryList?.data?.hour_rate}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Total Gross Payment:
                        </td>
                        <td className="center">
                            ${salaryList?.data?.gross_amount}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Previous Due:
                        </td>
                        <td className="center">
                            ${salaryList?.data?.previous_due}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Loan:
                        </td>
                        <td className="center">
                            ${salaryList?.data?.loan_balance}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Total Payable Amount:
                        </td>
                        <td className="center">${salaryList?.data?.net_pay}</td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Total Payment:
                        </td>
                        <td className="center">
                            ${salaryList?.data?.payment_amount}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="right">
                            Total Due Amount:
                        </td>
                        <td className="center">
                            ${salaryList?.data?.due_amount}
                        </td>
                    </tr>
                </>
            );
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
                <h2 className={styles.tableTitle}>Payment Details</h2>
                <p className={styles.tableTitle}>
                    Employee Name - {salaryList?.data?.employee_name}
                </p>
                <p className={styles.tableTitle}>
                    Payment Date - {salaryList?.data?.payment_date}
                </p>
                <table className={styles.container}>
                    <thead>
                        <tr>
                            <td>SL</td>
                            <td>Date</td>
                            <td>Sign In</td>
                            <td>Sign Out</td>
                            <td>Total Hour</td>
                            <td>Hour Rate</td>
                            <td>Gross Amount</td>
                        </tr>
                    </thead>
                    <tbody>{content}</tbody>
                </table>
            </div>
        );
    }
);

PaymentHistoryDetailsEmployee.propTypes = {
    reference: PropTypes.string,
    employeeId: PropTypes.any,
    setDate: PropTypes.func,
    setName: PropTypes.func,
};

PaymentHistoryDetailsEmployee.displayName =
    'Payment Report Details Employee Table';

export default PaymentHistoryDetailsEmployee;
