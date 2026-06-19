import { DEALER_AUTH, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SIGNUP_SUCCESS } from "./actionType";

const initialState = {
  isauth: false,
  isdealerauth: false,
  token: "",
  isLoading: false,
  isError: false,
  errorMessage: "",
  username: "",
  userRole: "",
  userId: ""
};

// Helper to check if user is authenticated from localStorage
const checkAuthFromStorage = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  if (token && userRole) {
    return {
      isauth: true,
      isdealerauth: userRole === 'dealer',
      token,
      username: userName || "",
      userRole,
      userId: userId || ""
    };
  }
  return null;
};

export const reducer = (state = initialState, action) => {
  const { type, payload, name } = action;
  
  console.log('Auth Reducer:', { type, payload, name });

  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: ""
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isauth: true,
        isdealerauth: false,
        token: payload,
        isLoading: false,
        isError: false,
        username: name,
        errorMessage: ""
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: payload,
        isauth: false,
        isdealerauth: false,
        token: "",
        username: ""
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: ""
      };

    case DEALER_AUTH:
      return {
        ...state,
        isdealerauth: true,
        isauth: true,
        isLoading: false,
        isError: false,
        token: payload,
        username: name,
        errorMessage: ""
      };

    case LOGOUT:
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      
      return {
        ...initialState
      };

    default:
      // Check localStorage on initial load
      const storedAuth = checkAuthFromStorage();
      if (storedAuth && !state.isauth) {
        return {
          ...state,
          ...storedAuth
        };
      }
      return state;
  }
};