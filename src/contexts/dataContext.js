import React, { createContext, useReducer } from "react";

const initialState = {
  isPopupVisible: false,
  isItemAdded: false,
  // Add more state properties as needed
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
    // Add more cases for other actions as needed
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

  // Add more functions to update the state as needed

  return (
    <AppContext.Provider
      value={{
        isPopupVisible: state.isPopupVisible,
        isItemAdded: state.isItemAdded,
        openPopup,
        closePopup,
        newItemIsAdded,
        revertIsItemAdded,
        // Add more state properties and functions as needed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
