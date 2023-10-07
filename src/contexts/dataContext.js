import React, { createContext, useReducer } from "react";

const initialState = {
  isPopupVisible: false,
  isItemAdded: false,
  isQrPopupVisible: false,
  // Add more state properties as needed
  isCommonPopupVisible: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_POPUP":
      return { ...state, isPopupVisible: true };
    case "CLOSE_POPUP":
      return { ...state, isPopupVisible: false };
    case "ITEM_ADDED":
      return { ...state, isItemAdded: true };
    case "REVERT_ITEM_ADDED":
      return { ...state, isItemAdded: false };
    case "OPEN_QR_POPUP":
      return { ...state, isQrPopupVisible: true };
    case "CLOSE_QR_POPUP":
      return { ...state, isQrPopupVisible: false };
    // Add more cases for other actions as needed
    case "OPEN_COMMON_POPUP":
      return { ...state, isCommonPopupVisible: true };
    case "CLOSE_COMMON_POPUP":
      return { ...state, isCommonPopupVisible: false };
    default:
      return state;
  }
};

const AppContext = createContext();
const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openPopup = () => {
    dispatch({ type: "OPEN_POPUP" });
  };

  const closePopup = () => {
    dispatch({ type: "CLOSE_POPUP" });
  };

  const newItemIsAdded = () => {
    dispatch({ type: "ITEM_ADDED" });
  };
  const revertIsItemAdded = () => {
    dispatch({ type: "REVERT_ITEM_ADDED" });
  };
  const openQrPopUp = () => {
    dispatch({ type: "OPEN_QR_POPUP" });
  };
  const closeQrPopUp = () => {
    dispatch({ type: "CLOSE_QR_POPUP" });
  };

  // Add more functions to update the state as needed
  const openCommonPopup = () => {
    dispatch({ type: "OPEN_COMMON_POPUP" });
  };

  const closeCommonPopup = () => {
    dispatch({ type: "CLOSE_COMMON_POPUP" });
  };

  return (
    <AppContext.Provider
      value={{
        isPopupVisible: state.isPopupVisible,
        isItemAdded: state.isItemAdded,
        isCommonPopupVisible: state.isCommonPopupVisible,
        openPopup,
        closePopup,
        newItemIsAdded,
        revertIsItemAdded,
        openQrPopUp,
        closeQrPopUp,
        // Add more state properties and functions as needed
        openCommonPopup,
        closeCommonPopup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
