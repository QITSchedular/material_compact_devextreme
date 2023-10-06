import notify from "devextreme/ui/notify";
import { AppContext } from "../contexts/dataContext";
import { useContext, useState } from "react";
import { Toast, Position } from "devextreme-react/toast";
import Swal from "sweetalert2";
import failureLottie from "../assets/images/failure-lottie.gif";
import successLottie from "../assets/images/success-lottiie-2.gif";

import "./notification.styles.scss";
export const showToastNotifications = async (data, position, direction) => {
  const { hasError, statusCode, statusMsg } = data;
  if (hasError === false) {
    // await renderSuccessComponent(statusMsg);
    const textMessage =
      statusMsg === "Saved Successfully!!!"
        ? "Item saved successfully"
        : statusMsg;
    notify(
      {
        message: textMessage,
        width: 300,
        shading: true,
        displayTime: 13000,
        type: "success",
        closeOnClick: true,
        hideOnOutsideClick: true,
        contentComponent: "<h1>Hello</h1>",
      },
      {
        position: position ? position : "center",
        direction: direction ? direction : "up-push",
      }
    );
  } else {
    notify(
      {
        message: statusMsg,
        width: 300,
        shading: true,
        displayTime: 13000,
        type: "error",
        closeOnClick: true,
        hideOnOutsideClick: true,
      },
      {
        position: position ? position : "center",
        direction: direction ? direction : "up-push",
      }
    );
  }
};

// const showMessage = async () => {
//   await notify({
//     message: "You have a new message",
//     type: "success",
//     displayTime: 116000,
//     position: "top-right",
//     width: 100,
//     icon: "check",
//   });
// };

// const successContentRender = (statusMsg) => {
//   return (
//     <div
//       class="flex-box"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: "5px",
//         background: "#efefef",
//         fontSize: "35px",
//       }}
//     >
//       <i
//         class="dx-icon-email icon-style"
//         style={{ width: "100px", height: "100px" }}
//       ></i>
//       <span>{statusMsg} &nbsp;</span>
//     </div>
//   );
// };

// export const SuccessToast = ({ visible }) => {
//   return (
//     <div id="container" style={{ minHeight: "100vh", minWidth: "100vh" }}>
//       <Toast
//         visible={true}
//         width={350}
//         height={280}
//         type="custom"
//         contentRender={() => successContentRender("statusMsg")}
//         displayTime={16000}
//       />
//       <Position my="top" at="top" of=".item-master-popup-container" />
//     </div>
//   );
// };
// const renderSuccessComponent = (statusMsg) => {
//   return <SuccessToast statusMsg={statusMsg} />;
// };

export const SwalDisplayer = (type, title, text) => {
  /*
    will recieve props
  */

  if (type === "success") {
    return Swal.fire({
      title: title,
      text: text ? text : "",
      imageUrl: `${successLottie}`,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "operation successful",
      timer: 4000,
    });
  }
  if (type === "error") {
    return Swal.fire({
      title: title,
      text: text ? text : "",
      imageUrl: `${failureLottie}`,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "operation failed",
      timer: 3000,
    });
  }
};
