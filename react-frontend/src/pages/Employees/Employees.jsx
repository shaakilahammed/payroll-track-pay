import styles from './Employees.module.css';
import EmployeesTable from '../../components/Table/EmployeeDataTable/EmployeesTable';
import AddEmployeeModal from '../../components/Modals/AddEmployeeModal';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditEmployeeModal from '../../components/Modals/EditEmployeeModal';
import { resetEmployee } from '../../features/employee/employeeSlice';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';

const Employees = () => {
  let tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'employee-data',
    pageStyle: () => `
    @page {
      size: landscape; /* or portrait, based on your preference */
    }
    `,
  });
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const employee = useSelector((state) => state.employee);
  // console.log(employee);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditOpenModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
    dispatch(resetEmployee());
  };

  useEffect(() => {
    if (employee?.id) handleEditOpenModal();
  }, [employee?.id]);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>All Employees</h2>
          {/* <div className={styles.search}>
            <label>
              <input type="text" placeholder="Search" />
              <IoIosSearch className={styles.icon} />
            </label>
          </div> */}
          <Link to="#" className={styles.btn} onClick={handlePrint}>
            Print
          </Link>
          <button className={styles.addButton} onClick={handleOpenModal}>
            Add Employee
          </button>
        </div>
        <EmployeesTable ref={tableRef} />
      </div>
      <AddEmployeeModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={handleEditCloseModal}
        id={employee?.id}
      />
    </div>
  );
};

export default Employees;
