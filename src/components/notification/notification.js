import React, { useEffect, useState } from "react";
import { Toast } from "devextreme-react/toast";
import notify from "devextreme/ui/notify";
const NotificationToast = ({ notificationData }) => {
  const [visible, setVisible] = useState(true);
  const handleHideNotif = () => {
    setVisible(false);
  };
  if (notificationData.hasError === false) {
    return notify({
      message: `${notificationData.statusMsg}`,
      type: "success",
      displayTime: 600,
      position: "top-right",
      width: 100,
      icon: "check",
    });
  } else {
    return notify({
      message: `${notificationData.statusMsg}`,
      type: "error",
      displayTime: 100,
      position: "top-right",
      width: 200,
    });
  }
};

export default NotificationToast;
