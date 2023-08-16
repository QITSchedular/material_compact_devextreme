import React, { createContext, useReducer } from "react";

const initialState = {
  isToastModal:false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MODAL_TOAST_TRUE":
      return { ...state, isToastModal: true };
    case "MODAL_TOAST_FALSE":
      return { ...state, isToastModal: false };
    default:
      return state;
  }
};

const ToastContext = createContext();
const ToastContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toastModalTrue = () => {
    dispatch({ type: "MODAL_TOAST_TRUE" });
  };
  const toastModalFalse = () => {
    dispatch({ type: "MODAL_TOAST_FALSE" });
  };

  return (
    <ToastContext.Provider
      value={{
        isToastModal:state.isToastModal,
        toastModalTrue,
        toastModalFalse
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastContextProvider };
