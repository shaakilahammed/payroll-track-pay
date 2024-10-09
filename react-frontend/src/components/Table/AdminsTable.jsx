import { RiEdit2Line, RiEyeLine, RiDeleteBinLine } from 'react-icons/ri';
import styles from './Table.module.css';

const AdminsTable = () => {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <td>SL</td>
          <td>Name</td>
          <td>Email</td>
          <td>Mobile</td>
          <td>Username</td>
          <td>Password</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Sabbir Mahmud</td>
          <td>sa@gmail.com</td>
          <td>0125454646</td>
          <td>sabbir</td>
          <td>12345</td>
          <td className={styles.actions}>
            <button className={`${styles.iconButton} ${styles.info}`}>
              <RiEyeLine className={styles.icon} />
            </button>
            <button className={`${styles.iconButton} ${styles.edit}`}>
              <RiEdit2Line className={styles.icon} />
            </button>
            <button className={`${styles.iconButton} ${styles.delete}`}>
              <RiDeleteBinLine className={styles.icon} />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default AdminsTable;
