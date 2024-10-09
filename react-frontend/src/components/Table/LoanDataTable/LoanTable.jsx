import PropTypes from 'prop-types';
import React from 'react';
import creatorsCityImage from '../../../assets/creatorsCityx125.png';
import { useGetLoansQuery } from '../../../features/loan/loanApi';
import getMonthName from '../../../utils/getMonthName';
import TableMessage from '../../UI/TableMessage';
import styles from '../Table.module.css';
import LoanDataRow from './LoanDataRow';

const LoanTable = React.forwardRef(({ selectedYear, selectedMonth }, ref) => {
    const {
        data: loans,
        isLoading,
        isError,
        error,
    } = useGetLoansQuery({
        month: selectedMonth,
        year: selectedYear,
    });

    let content = null;
    if (isLoading) {
        content = <TableMessage colSpan={4} message="Loading...." />;
    }
    if (!isLoading && isError) {
        content = <TableMessage colSpan={4} message={error?.message} />;
    }

    if (!isLoading && !isError && loans?.data?.length === 0) {
        content = <TableMessage colSpan={4} message="No Loan found!" />;
    }

    if (!isLoading && !isError && loans?.data?.length > 0) {
        content = loans?.data?.map((item, index) => (
            <LoanDataRow key={item.id} loan={{ sl: index + 1, ...item }} />
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
            <h3 className={styles.tableTitle}>
                Loan Data for {getMonthName(selectedMonth)}, {selectedYear}
            </h3>
            <table className={styles.container}>
                <thead>
                    <tr>
                        <td>SL</td>
                        <td>Name</td>
                        <td>Loan Amount</td>
                        <td>Date</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>{content}</tbody>
            </table>
        </div>
    );
});

LoanTable.displayName = 'Loans Table';

LoanTable.propTypes = {
    selectedMonth: PropTypes.any,
    selectedYear: PropTypes.any,
};
export default LoanTable;
