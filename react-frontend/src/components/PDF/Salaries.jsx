import React from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';

const tableStyles = {
  container: {
    borderCollapse: 'collapse',
    marginTop: 20,
    width: '100%',
    // padding: 20,
    boxSizing: 'border-box',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#0b6fa4',
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    width: '300px',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
};

const styles = StyleSheet.create({
  ...tableStyles,
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    padding: 40,
    boxSizing: 'border-box',
    fontSize: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
});

const Salaries = ({ data }) => (
  <Document>
    <Page style={styles.page} orientation="landscape" size="A4">
      <View style={styles.container}>
        {/* Table Header */}
        <Text style={styles.title}>Salary Details</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>SL</Text>
          <Text style={[styles.tableCell, styles.tableHeader, styles.name]}>
            Name
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            Hourly Rate
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            Total Hours
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            Gross Payment
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Loan</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            Previous Due
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Net Pay</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Payment</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Due</Text>

          {/* <td>SL</td>
            <td>Name</td>
            <td>Hour Rate</td>
            <td>Total Hours</td>
            <td>Gross Payment</td>
            <td>Loan</td>
            <td>Previous Due</td>
            <td>Net Pay</td>
            <td className={styles.payment_amount}>Payment</td>
            <td>Due</td> */}
          {/* Add more header cells */}
        </View>

        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.hour_rate}</Text>
            <Text style={styles.tableCell}>{item.total_hour}</Text>
            <Text style={styles.tableCell}>{item.gross_payment}</Text>
            <Text style={styles.tableCell}>{item.loan}</Text>
            <Text style={styles.tableCell}>{item.previous_due}</Text>
            <Text style={styles.tableCell}>{item.net_pay}</Text>
            <Text style={styles.tableCell}>{item.payment_amount}</Text>
            <Text style={styles.tableCell}>{item.due_amount}</Text>
            {/* Add more data cells */}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default Salaries;
