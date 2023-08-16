import React, { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { ToastContext } from '../../contexts/toastContext';

const CommonToast = () => {
  const { isToastModal } = useContext(ToastContext);
  
  const toasterProps = {
    reverseOrder: false,
  };

  if (isToastModal) {
    toasterProps.containerStyle = {
      top: 200,
    };
    toasterProps.toastOptions = {
      toastStyle: {
        background: '#333',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      },
      toastClassName: 'custom-toast',
    };
  } else {
    toasterProps.position = 'top-right';
  }

  return (
    <div>
      <Toaster {...toasterProps} />
    </div>
  );
};

export default CommonToast;
