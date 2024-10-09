import PropTypes from 'prop-types';
const TableMessage = ({ colSpan, message }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="center">
        {message}
      </td>
    </tr>
  );
};

TableMessage.propTypes = {
  colSpan: PropTypes.number,
  message: PropTypes.string,
};

export default TableMessage;
