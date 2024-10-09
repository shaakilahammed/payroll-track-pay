import { useGetWorkingEmployeesDataQuery } from "../../features/dashboard/dashboardApi";
import TableMessage from "../UI/TableMessage";
import styles from "./Table.module.css";

const Table = () => {
  const {
    data: employees,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetWorkingEmployeesDataQuery();
  let content = null;
  if (isLoading) {
    content = <TableMessage colSpan={7} message="Loading...." />;
  }
  if (!isLoading && isError) {
    content = <TableMessage colSpan={7} message={error?.message} />;
  }

  if (!isLoading && !isError && isSuccess && !employees?.data) {
    content = <TableMessage colSpan={7} message="No employee is present!" />;
  }

  if (!isLoading && !isError && isSuccess && employees?.data?.length > 0) {
    content = employees?.data?.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>$ {item.hour_rate}</td>
        <td>{item.sign_in}</td>
        <td>{item.sign_out}</td>
        <td>{item.total_hour}</td>
        <td>$ {item.amount}</td>
      </tr>
    ));
  }
  return (
    <table className={`${styles.container} ${styles.marginBbottom0}`}>
      <thead>
        <tr>
          <td>SL</td>
          <td>Name</td>
          <td>Hour Rate</td>
          <td>Sign in</td>
          <td>Sign out</td>
          <td>Total Hour</td>
          <td>Amount</td>
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  );
};

export default Table;
