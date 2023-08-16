import React, { useContext} from "react";
import success from "../../assets/images/success.gif";
import error from "../../assets/images/error.gif";
import { toast, Toaster } from "react-hot-toast";
import "./toastModal.scss";
import { AppContext } from "../../contexts/dataContext";
// // import React from 'react'

// const ToastModal = ({type, message, configType}) => {
//   const { toastModalFalse,toastModalTrue } = useContext(AppContext);
//   if(configType){
//     toastModalTrue();
//   }else{
//     toastModalFalse();
//   } 
//   toast.custom(
//     (t) => (
//       <div className="dx-card responsive-paddings item-master-popup-container">
//         <div className="cancelPopUp">
//           <span className="custom-close" onClick={() => toast.dismiss(t.id)}>
//             &times;
//           </span>
//         </div>
//         <div className="content-blocks popupalertCss">
//           <div alt="success" className="popupImg">
//             {type == "success" ? (
//               <img src={success} className="imgCss" />
//             ) : (
//               <img src={error} className="imgCss" height="150" width="150" />
//             )}
//           </div>
//           <div className="popupCaption">
//             <span className="title"> {message}</span>
//           </div>
//         </div>
//       </div>
//     ),
//     {
//       duration: 700,
//     }
//   );
// }
// export default ToastModal;




// import React, { useContext } from "react";
// import success from "../../assets/images/success.gif";
// import error from "../../assets/images/error.gif";
// import { toast } from "react-hot-toast";
// import { AppContext } from "../../contexts/dataContext";

// const ToastModal = () => {
// // const ToastModal = ({ type, message, configType }) => {
//   // const { toastModalFalse, toastModalTrue } = useContext(AppContext);
//   console.log("sdbhjbxcxjkbsdc")
//   // if (configType) {
//   //   toastModalTrue();
//   // } else {
//   //   toastModalFalse();
//   // }
//   return (
//     <>
//       {alert()}
//     </>
//   )
//   // return toast.custom(
//   //   (t) => (
//   //     <div className="dx-card responsive-paddings item-master-popup-container">
//   //       <div className="cancelPopUp">
//   //         <span className="custom-close" onClick={() => toast.dismiss(t.id)}>
//   //           &times;
//   //         </span>
//   //       </div>
//   //       <div className="content-blocks popupalertCss">
//   //         <div alt="success" className="popupImg">
//   //           {type === "success" ? (
//   //             <img src={success} className="imgCss" alt="Success" />
//   //           ) : (
//   //             <img src={error} className="imgCss" height="150" width="150" alt="Error" />
//   //           )}
//   //         </div>
//   //         <div className="popupCaption">
//   //           <span className="title">{message}</span>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ),
//   //   {
//   //     duration: 700,
//   //   }
//   // );
// };

// export default ToastModal;

// export const ShowToast = (type1, message1,configTYpe1) => {
//   toast(<ToastModal />)
//   // <ToastModal type={type1} message={message1} configType={configTYpe1} />
// };


// it`s not working with context passed through this page
// import React, { useContext } from "react";
// import success from "../../assets/images/success.gif";
// import error from "../../assets/images/error.gif";
// import { toast } from "react-hot-toast";
// import { AppContext } from "../../contexts/dataContext";

// export const ToastModal = ({ type, message, configType }) => {
//   const { toastModalFalse, toastModalTrue } = useContext(AppContext);
//   if (configType) {
//     toastModalTrue();
//   } else {
//     toastModalFalse();
//   }
// // Render the toast modal based on type and message
//    return toast.custom(
//     (t) => (
//       <div className="dx-card responsive-paddings item-master-popup-container">
//         <div className="cancelPopUp">
//           <span className="custom-close" onClick={() => toast.dismiss(t.id)}>
//             &times;
//           </span>
//         </div>
//         <div className="content-blocks popupalertCss">
//           <div alt="success" className="popupImg">
//             {type === "success" ? (
//               <img src={success} className="imgCss" alt="Success" />
//             ) : (
//               <img src={error} className="imgCss" height="150" width="150" alt="Error" />
//             )}
//           </div>
//           <div className="popupCaption">
//             <span className="title">{message}</span>
//           </div>
//         </div>
//       </div>
//     ),
//     {
//       duration: 700,
//     }
//   );
// };

// export const ShowToast = (type, message, configType) => {
//   toast(<ToastModal type={type} message={message} configType={configType}/>);
// };

// export default ToastModal;




 const ShowToast = (type, message, configType) => {
  toast.custom(
    (t) => (
      <div className="dx-card responsive-paddings item-master-popup-container">
        <div className="cancelPopUp">
          <span className="custom-close" onClick={() => toast.dismiss(t.id)}>
            &times;
          </span>
        </div>
        <div className="content-blocks popupalertCss">
          <div alt="success" className="popupImg">
            {type == "success" ? (
              <img src={success} className="imgCss" />
            ) : (
              <img src={error} className="imgCss" height="150" width="150" />
            )}
          </div>
          <div className="popupCaption">
            <span className="title"> {message}</span>
          </div>
        </div>
      </div>
    ),
    {
      duration: 700,
    }
  );
};
export default ShowToast;
// usage of toast
//  toastModalFalse();
// toastModalTrue(); 
// ShowToast("success","Successfully loaded..!!");
// ShowToast('error', "Oops something wrong..!!");
// ShowMiniToast("darksuccess","successfully done");