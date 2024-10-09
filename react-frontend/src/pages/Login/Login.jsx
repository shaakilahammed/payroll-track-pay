import { ToastContainer } from 'react-toastify';
import LoginForm from '../../components/Forms/LoginForm';
import styles from './Login.module.css';

const Login = () => {
  return (
    <>
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
      <div className={styles.container}>
        <h1>Welcome Back!</h1>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
