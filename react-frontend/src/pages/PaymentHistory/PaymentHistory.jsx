import { Link, useParams } from 'react-router-dom';
import PaymentHistoryTable from '../../components/Table/PaymentHistoryTable/PaymentHistoryTable';
import styles from './PaymentHistory.module.css';
import PaymentHistoryDetailsTable from '../../components/Table/PaymentHistoryTable/PaymentHistoryDetailsTable';
import { useRef, useState } from 'react';
import PaymentHistoryDetailsEmployee from '../../components/Table/PaymentHistoryTable/PaymentHistoryDetailsEmployee';
import { useReactToPrint } from 'react-to-print';
const PaymentHistory = () => {
  const { reference, employeeId } = useParams();
  const [paymentDate, setPaymentDate] = useState('');
  const [name, setName] = useState('');
  let tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: `payment-report-${reference}`,
    pageStyle: () => '',
  });

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>Payment History {employeeId && `for ${name}`}</h2>

          {reference && (
            <>
              <span>
                {reference} <br /> Payment Date: {paymentDate}
              </span>
              <Link to="#" className={styles.btn} onClick={handlePrint}>
                Print
              </Link>
            </>
          )}
        </div>
        {reference && employeeId ? (
          <PaymentHistoryDetailsEmployee
            reference={reference}
            employeeId={employeeId}
            setDate={setPaymentDate}
            setName={setName}
            ref={tableRef}
          />
        ) : reference ? (
          <PaymentHistoryDetailsTable
            reference={reference}
            setDate={setPaymentDate}
            ref={tableRef}
          />
        ) : (
          <PaymentHistoryTable />
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
