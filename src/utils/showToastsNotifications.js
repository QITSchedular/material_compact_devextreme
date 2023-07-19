import notify from "devextreme/ui/notify";
import { AppContext } from "../contexts/dataContext";
import { useContext, useState } from "react";
import { Toast, Position } from "devextreme-react/toast";

export const showToastNotifications = async (data) => {
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
      { position: "center", direction: "up-push" }
    );
  } else {
    // notify({
    //   message: `${statusMsg}`,
    //   type: "error",
    //   displayTime: 100,
    //   position: "top-right",
    //   width: 200,
    // });
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
      { position: "center", direction: "up-push" }
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
