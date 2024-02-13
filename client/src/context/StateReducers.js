import { reducerCases } from "./StateContext";

// Initial state for the application
export const initialState = {
  userInfo: undefined, // User information
  newUser: false, // Flag indicating whether the user is new
  contactsPage: false, // Flag indicating the current page (contacts or not)
  messagesSearch: false, // Flag indicating if messages are being searched
  currentChatUser: undefined, // Current chat user
  currentProfileUser: undefined, // Current profile user
  messages: [], // Array to store messages
  socket: undefined, // WebSocket connection
};

// Reducer function to manage state changes
const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER_INFO:
      localStorage.setItem('userInfo', JSON.stringify(action.userInfo));
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    case reducerCases.CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.user,
      };
    case reducerCases.CHANGE_CURRENT_PROFILE_USER:
      return {
        ...state,
        currentProfileUser: action.user,
      };
    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducerCases.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    case reducerCases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    default:
      return state;
  }
};

export default reducer;
