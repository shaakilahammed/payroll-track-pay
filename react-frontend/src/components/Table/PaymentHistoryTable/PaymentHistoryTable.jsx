import { RiEyeLine } from "react-icons/ri";
import { useGetPaymentHistoryListQuery } from "../../../features/salary/salaryApi";
import TableMessage from "../../UI/TableMessage";
import styles from "../Table.module.css";
import { Link } from "react-router-dom";

const PaymentHistoryTable = () => {
  const {
    data: reportList,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useGetPaymentHistoryListQuery();
  let content = null;
  if (isLoading) {
    content = <TableMessage colSpan={4} message="Loading...." />;
  }

  if (!isLoading && isError) {
    content = <TableMessage colSpan={4} message={error?.message} />;
  }

  if (!isLoading && !isError && isSuccess && reportList?.data?.length === 0) {
    content = <TableMessage colSpan={4} message="No Payment Data found!" />;
  }

  if (!isLoading && !isError && isSuccess && reportList?.data?.length > 0) {
    content = reportList?.data?.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.reference}</td>
        <td>{item.payment_date}</td>
        <td>${item.total_payment}</td>
        <td className={styles.actions}>
          <Link to={`/payment-history/${item.reference}`}>
            <button className={`${styles.iconButton} ${styles.info}`}>
              <RiEyeLine className={styles.icon} />
            </button>
          </Link>
        </td>
      </tr>
    ));
  }

  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <td>SL</td>
            <td className={styles.reference_cell}>Reference Name</td>
            <td className={styles.date_cell}>Date</td>
            <td>Total Payment</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </>
  );
};

export default PaymentHistoryTable;
