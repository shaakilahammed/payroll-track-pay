import styles from '../Table.module.css';

import TableMessage from '../../UI/TableMessage';
import AdministratorDataRow from './AdministratorDataRow';
import { useGetAdministratorsQuery } from '../../../features/administrator/administratorApi';

const AdministratorTable = () => {
  const {
    data: administrators,
    isLoading,
    isError,
    error,
  } = useGetAdministratorsQuery();

  let content = null;
  if (isLoading) {
    content = <TableMessage colSpan={6} message="Loading...." />;
  }
  if (!isLoading && isError) {
    content = <TableMessage colSpan={6} message={error?.message} />;
  }

  if (!isLoading && !isError && administrators?.data?.length === 0) {
    content = <TableMessage colSpan={6} message="No administrator found!" />;
  }

  if (!isLoading && !isError && administrators?.data?.length > 0) {
    content = administrators?.data?.map((item, index) => (
      <AdministratorDataRow
        key={item.id}
        administrator={{ sl: index + 1, ...item }}
      />
    ));
  }
  return (
    <table className={`${styles.container}`}>
      <thead>
        <tr>
          <td>SL</td>
          <td>Name</td>
          <td>Email</td>
          <td className={styles.mobile}>Mobile</td>
          <td className={styles.type}>Type</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  );
};

export default AdministratorTable;
