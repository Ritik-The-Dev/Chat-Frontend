import { createContext, useContext, useReducer } from "react";

// Create a context for managing state
export const StateContext = createContext();

// State provider component to wrap the application and manage state
export const StateProvider = ({ initialState, reducer, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Custom hook to access the state and dispatch function
export const useStateProvider = () => useContext(StateContext);

// Enumerated cases for reducer actions
export const reducerCases = {
  SET_USER_INFO: "SET_USER_INFO", // Set user info action
  SET_NEW_USER: "SET_NEW_USER", // Set new user action
  SET_ALL_CONTACTS_PAGE: "SET_ALL_CONTACTS_PAGE", // Set all contacts page action
  CHANGE_CURRENT_CHAT_USER: "CHANGE_CURRENT_CHAT_USER", // Change current chat user action
  CHANGE_CURRENT_PROFILE_USER: "CHANGE_CURRENT_PROFILE_USER", // Change current profile user action
  SET_MESSAGES: "SET_MESSAGES", // Set messages action
  ADD_MESSAGE: "ADD_MESSAGE", // Add message action
  SET_SOCKET: "SET_SOCKET", // Set socket action
  SET_MESSAGE_SEARCH: "SET_MESSAGE_SEARCH", // Set message search action
};
