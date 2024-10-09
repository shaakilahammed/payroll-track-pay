import PropTypes from 'prop-types';
import React from 'react';
import { RiEyeLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import { useGetPaymentHistoryByReferenceQuery } from '../../../features/salary/salaryApi';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';

const PaymentHistoryDetailsTable = React.forwardRef(
    ({ reference, setDate }, ref) => {
        const {
            data: salaryList,
            isError,
            isSuccess,
            isLoading,
            error,
        } = useGetPaymentHistoryByReferenceQuery(reference);
        let content = null;
        if (isLoading) {
            content = <TableMessage colSpan={4} message="Loading...." />;
        }

        if (!isLoading && isError) {
            content = <TableMessage colSpan={4} message={error?.message} />;
        }

        if (
            !isLoading &&
            !isError &&
            isSuccess &&
            salaryList?.data?.salaries?.length === 0
        ) {
            content = (
                <TableMessage colSpan={4} message="No Payment Data found!" />
            );
        }

        if (
            !isLoading &&
            !isError &&
            isSuccess &&
            salaryList?.data?.salaries?.length > 0
        ) {
            content = (
                <>
                    {salaryList?.data?.salaries?.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.employee.name}</td>
                            <td>{item.hour_rate}</td>
                            <td>{item.total_hour}</td>
                            <td>${item.gross_payment}</td>
                            <td>${item.loan_balance}</td>
                            <td>${item.previous_due}</td>
                            <td>${item.net_pay}</td>
                            <td>${item.payment_amount}</td>
                            <td>${item.due_amount}</td>
                            <td
                                className={`${styles.actions} ${styles.hideOnPrint}`}
                            >
                                <Link
                                    to={`/payment-history/${item.reference}/${item.employee_id}`}
                                >
                                    <button
                                        className={`${styles.iconButton} ${styles.info}`}
                                    >
                                        <RiEyeLine className={styles.icon} />
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td colSpan="11"></td>
                    </tr>
                    {/* for print */}
                    <tr>
                        <td colSpan="9" className="right">
                            Total Hours:
                        </td>
                        <td colSpan="2" className="center">
                            {salaryList?.data?.total_hour}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" className="right">
                            Total Gross Payment:
                        </td>
                        <td colSpan="2" className="center">
                            ${salaryList?.data?.total_gross_payment}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" className="right">
                            Total Payable Amount:
                        </td>
                        <td colSpan="2" className="center">
                            ${salaryList?.data?.total_net_pay}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" className="right">
                            Total Payment:
                        </td>
                        <td colSpan="2" className="center">
                            ${salaryList?.data?.total_sum_payment}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="9" className="right">
                            Total Due Amount:
                        </td>
                        <td colSpan="2" className="center">
                            ${salaryList?.data?.total_due_amount}
                        </td>
                    </tr>
                </>
            );
            setDate(salaryList?.data?.payment_date);
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
                    Start Date - {salaryList?.data?.start_date}
                </p>
                <p className={styles.tableTitle}>
                    End Date - {salaryList?.data?.end_date}
                </p>
                <p className={styles.tableTitle}>
                    Payment Date - {salaryList?.data?.payment_date}
                </p>
                <table className={styles.container}>
                    <thead>
                        <tr>
                            <td>SL</td>
                            <td>Name</td>
                            <td>Hour Rate</td>
                            <td>Total Hour</td>
                            <td>Gross Payment</td>
                            <td>Loan</td>
                            <td>Previous Due</td>
                            <td>Payable</td>
                            <td>Payment</td>
                            <td>Due</td>
                            <td className={styles.hideOnPrint}>Action</td>
                        </tr>
                    </thead>
                    <tbody>{content}</tbody>
                </table>
            </div>
        );
    }
);

PaymentHistoryDetailsTable.propTypes = {
    reference: PropTypes.string,
    setDate: PropTypes.func,
};

PaymentHistoryDetailsTable.displayName = 'Payment Report Details Table';

export default PaymentHistoryDetailsTable;
