import { toast, ToastOptions } from 'react-toastify';

const options: ToastOptions = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
}

export const successNotification = (message: string) => toast.success(message, options);
export const errorNotification = (message: string) => toast.error(message, options);
