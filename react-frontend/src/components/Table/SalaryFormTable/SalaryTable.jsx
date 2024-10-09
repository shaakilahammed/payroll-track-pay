import { useEffect, useState } from 'react';
import styles from '../Table.module.css';
import PropTypes from 'prop-types';
import TableMessage from '../../UI/TableMessage';
import getCurrentDate from '../../../utils/getCurrentDate';
import getUniqueReference from '../../../utils/getUniqueReference';
import { useAddSalaryMutation } from '../../../features/salary/salaryApi';
import Swal from 'sweetalert2';
import showToast from '../../UI/Toast';
import { useNavigate } from 'react-router-dom';

const SalaryTable = ({ salaries, startDate, endDate }) => {
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState(
    salaries?.map((item) => ({
      ...item,
      hour_rate: item.hour_rate ? item.hour_rate : '$0.00',
      start_date: startDate,
      end_date: endDate,
      previous_due: item.due_balance,
      loan_balance: item.loan,
      payment_amount: item.net_pay > 0 ? item.net_pay : 0,
      due_amount: 0,
      date: getCurrentDate(),
      reference: getUniqueReference(startDate, endDate),
    }))
  );

  const [addSalary, { data, isSuccess, isError, error, isLoading }] =
    useAddSalaryMutation();

  useEffect(() => {
    if (isSuccess) {
      showToast('success', 'Salary generate successfully!');
      navigate(`/payment-history/${data?.data[0]?.reference}`);
    }
    if (isError) showToast('error', error?.message);
  }, [isSuccess, isError, error, data, navigate]);

  const handlePaymentChange = (e, index) => {
    const updatedSalaryData = [...salaryData];
    const paymentValue = e.target.value !== '' ? e.target.value : 0;
    if (updatedSalaryData[index].net_pay >= paymentValue) {
      updatedSalaryData[index].payment_amount = parseFloat(paymentValue);
      updatedSalaryData[index].due_amount =
        updatedSalaryData[index].net_pay > 0
          ? updatedSalaryData[index].net_pay -
            updatedSalaryData[index].payment_amount
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
        addSalary(salaryData);
      }
    });
  };
  let content = null;
  if (salaryData.length === 0) {
    content = <TableMessage colSpan={10} message="No data found!" />;
  }

  if (salaryData.length > 0) {
    content = salaryData?.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td> {item.name}</td>
        <td> {item.hour_rate}</td>
        <td> {item.total_hour}</td>
        <td>$ {item.gross_payment}</td>
        <td>$ {item.loan}</td>
        <td>$ {item.previous_due}</td>
        <td>$ {item.net_pay}</td>

        <td>
          $
          <label className={styles.input}>
            <input
              type="number"
              key={`payment_${index}`}
              value={isNaN(item.payment_amount) ? 0 : item.payment_amount}
              name="payment_amount"
              max={item.net_pay}
              min={0}
              onChange={(e) => handlePaymentChange(e, index)}
              required
            />
          </label>
        </td>
        <td>$ {item.net_pay > 0 ? item.net_pay - item.payment_amount : 0}</td>
      </tr>
    ));
  }
  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <td>SL</td>
            <td>Name</td>
            <td>Hour Rate</td>
            <td>Total Hours</td>
            <td>Gross Payment</td>
            <td>Loan</td>
            <td>Previous Due</td>
            <td>Net Pay</td>
            <td className={styles.payment_amount}>Payment</td>
            <td>Due</td>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
      {salaryData.length > 0 && (
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Salary Generate
        </button>
      )}

      {/* {salaryData.length > 0 && (
        // <PDFDownloadLink
        //   document={<Salaries data={salaryData} />}
        //   fileName="my-document.pdf"
        // >
        //   {({ blob, url, loading, error }) =>
        //     loading ? 'Generating PDF...' : 'Download PDF'
        //   }
        // </PDFDownloadLink>
        // <PDFViewer>
        //   <Salaries data={salaryData} />
        // </PDFViewer>
      )} */}
    </>
  );
};

SalaryTable.propTypes = {
  salaries: PropTypes.array,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};
export default SalaryTable;
