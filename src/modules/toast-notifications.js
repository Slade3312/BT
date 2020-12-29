import { toast } from 'react-toastify';

export const toastErrorNotification = (errorMessage) => {
  toast.error(errorMessage, {
    position: 'top-left',
    autoClose: 30000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
