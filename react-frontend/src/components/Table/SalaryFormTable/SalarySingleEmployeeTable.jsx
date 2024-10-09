import { useEffect, useState } from 'react';
import styles from '../Table.module.css';
import PropTypes from 'prop-types';
import TableMessage from '../../UI/TableMessage';
import getCurrentDate from '../../../utils/getCurrentDate';
import getUniqueReference from '../../../utils/getUniqueReference';
import { useAddSalaryMutation } from '../../../features/salary/salaryApi';
import showToast from '../../UI/Toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SalarySingleEmployeeTable = ({ salaries, startDate, endDate }) => {
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState({
    employee_id: salaries?.employee_id,
    start_date: startDate,
    end_date: endDate,
    hour_rate: salaries?.hour_rate ? salaries?.hour_rate : '$0.00',
    total_hour: salaries?.total_hour,
    gross_payment: salaries?.gross_amount,
    loan_balance: salaries?.loan_balance,
    previous_due: salaries?.due_balance,
    net_pay: salaries?.net_amount,
    payment_amount: salaries?.net_amount > 0 ? salaries?.net_amount : 0,
    due_amount: 0,
    date: getCurrentDate(),
    reference: getUniqueReference(startDate, endDate),
  });
  const [addSalary, { data, isSuccess, isError, error, isLoading }] =
    useAddSalaryMutation();
  useEffect(() => {
    if (isSuccess) {
      showToast('success', 'Salary generate successfully!');
      navigate(`/payment-history/${data?.data[0]?.reference}`);
    }
    if (isError) showToast('error', error?.message);
  }, [isSuccess, isError, error, navigate, data]);
  const handlePaymentChange = (e) => {
    const updatedSalaryData = { ...salaryData };
    const paymentValue = e.target.value !== '' ? e.target.value : 0;
    if (updatedSalaryData.net_pay >= paymentValue) {
      updatedSalaryData.payment_amount = parseFloat(paymentValue);
      updatedSalaryData.due_amount =
        updatedSalaryData.net_pay > 0
          ? updatedSalaryData.net_pay - parseFloat(paymentValue)
          : 0;
    }

    setSalaryData(updatedSalaryData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(salaryData);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Generate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        addSalary([salaryData]);
      }
    });
  };
  let content = null;
  if (salaries?.salary_data?.length === 0) {
    content = <TableMessage colSpan={5} message="No data found!" />;
  }

  if (salaries?.salary_data?.length > 0) {
    content = (
      <>
        {salaries?.salary_data?.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.date}</td>
            <td>{item.hour_rate}</td>
            <td>{item.total_hour}</td>
            <td>${item.gross_amount}</td>
          </tr>
        ))}
        <tr>
          <td colSpan="4" className="right">
            Total Hours:
          </td>
          <td>{salaries.total_hour}</td>
        </tr>
        <tr>
          <td colSpan="4" className="right">
            Total Gross Amount:
          </td>
          <td>{salaries.gross_amount}</td>
        </tr>
        <tr>
          <td colSpan="4" className="right">
            Previous Due:
          </td>
          <td>{salaries.due_balance}</td>
        </tr>
        <tr>
          <td colSpan="4" className="right">
            Loan:
          </td>
          <td>{salaries.loan_balance}</td>
        </tr>

        <tr>
          <td colSpan="4" className="right">
            Payable Amount:
          </td>
          <td>{salaries.net_amount}</td>
        </tr>

        <tr>
          <td colSpan="4" className="right">
            Payment Amount:
          </td>
          <td>
            $
            <label className={styles.input}>
              <input
                type="number"
                value={
                  isNaN(salaryData.payment_amount)
                    ? 0
                    : salaryData.payment_amount
                }
                name="payment_amount"
                max={salaries.net_amount}
                min={0}
                onChange={(e) => handlePaymentChange(e)}
                required
              />
            </label>
          </td>
        </tr>

        <tr>
          <td colSpan="4" className="right">
            Due Amount:
          </td>
          <td>${salaryData?.due_amount}</td>
        </tr>
      </>
    );
  }
  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <td>SL</td>
            <td>Date</td>
            <td>Hour Rate</td>
            <td>Total Hours</td>
            <td>Gross Amount</td>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
      {salaries?.salary_data?.length > 0 && (
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Salary Generate
        </button>
      )}
    </>
  );
};

SalarySingleEmployeeTable.propTypes = {
  salaries: PropTypes.shape(),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};
export default SalarySingleEmployeeTable;
