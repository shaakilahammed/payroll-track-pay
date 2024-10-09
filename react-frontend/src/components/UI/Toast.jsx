import { toast } from 'react-toastify';

const showToast = (type, message) => {
  const toastOptions = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  };

  switch (type) {
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export default showToast;
