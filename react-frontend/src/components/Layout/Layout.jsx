import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Header from '../Header/Header';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {
  const [shortMenu, setShortMenu] = useState(false);
  const toggleShortMenu = () => {
    setShortMenu((prev) => !prev);
  };

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar shortMenu={shortMenu} />
      <div className={`main ${shortMenu && 'active'}`}>
        <Header toggleShortMenu={toggleShortMenu} />
        {children}
        {/* <Footer /> */}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
