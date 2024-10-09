import styles from './Loan.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AddLoanModal from '../../components/Modals/AddLoanModal';
import getMonthList from '../../utils/getMonthList';
import getYearList from '../../utils/getYearList';
import LoanTable from '../../components/Table/LoanDataTable/LoanTable';
import EditLoanModal from '../../components/Modals/EditLoanModal';
import { useDispatch, useSelector } from 'react-redux';
import { resetLoan } from '../../features/loan/loanSlice';
import { useReactToPrint } from 'react-to-print';

const Loan = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const months = getMonthList();
  const years = getYearList();
  const [selectedMonth, setSelectedMonth] = useState(months[0].serial); // Initialize with empty string
  const [selectedYear, setSelectedYear] = useState(years[0]); // Initialize with empty string

  let tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'loan-data',
    pageStyle: () => `
    @page {
      size: landscape; /* or portrait, based on your preference */
    }`,
  });

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const loan = useSelector((state) => state.loan);
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
    dispatch(resetLoan());
  };

  useEffect(() => {
    if (loan?.id) handleEditOpenModal();
  }, [loan?.id]);
  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>Employees Loan</h2>
          <div className={styles.filter}>
            <div className={styles.month}>
              <label>
                <select
                  name="months"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {months?.map((item) => (
                    <option key={item.serial} value={item.serial}>
                      {item.month}
                    </option>
                  ))}
                </select>
                {/* <input type="text" placeholder="Search" />
              <IoIosSearch className={styles.icon} /> */}
              </label>
            </div>

            <div className={styles.year}>
              <label>
                <select
                  name="years"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {years?.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {/* <div className={styles.search}>
            <label>
              <input type="text" placeholder="Search" />
              <IoIosSearch className={styles.icon} />
            </label>
          </div> */}
          <div className={styles.buttons}>
            <Link to="#" className={styles.btn} onClick={handlePrint}>
              Print
            </Link>
            <button className={styles.addButton} onClick={handleOpenModal}>
              Add Loan
            </button>
          </div>
        </div>
        <LoanTable
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          ref={tableRef}
        />
      </div>
      <AddLoanModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <EditLoanModal
        isOpen={isEditModalOpen}
        onClose={handleEditCloseModal}
        id={loan?.id}
      />
    </div>
  );
};

export default Loan;
