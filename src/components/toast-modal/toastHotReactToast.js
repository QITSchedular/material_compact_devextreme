import React from "react";

import { toast, Toaster } from "react-hot-toast";
import "./toastModal.scss";

const ShowMiniToast = (type, message) => {
    switch(type){
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "darksuccess":
        toast.success(message,{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        });
        break;
        case "darkerror":
          toast.error(message,{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          });
        break;
    }
};
export default ShowMiniToast;
