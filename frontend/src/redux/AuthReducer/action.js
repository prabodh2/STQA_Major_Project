import axios from "axios"
import { DEALER_AUTH, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, SIGNUP_SUCCESS } from "./actionType";

const BASE_URL = "http://localhost:4000";

// Helper to store user data
const storeUserData = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userRole", data.user.role);
  localStorage.setItem("userName", data.user.name);
  localStorage.setItem("userId", data.user._id);
  console.log('Stored user data:', {
    token: data.token,
    role: data.user.role,
    name: data.user.name,
    id: data.user._id
  });
};

export const fetchLogin = (payload) => async (dispatch) => {
  console.log('Login attempt with:', payload);
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, payload);
    console.log('Login response:', response.data);

    if (response.data.token) {
      storeUserData(response.data);
      
      if (response.data.user.role === 'dealer') {
        console.log('Dispatching dealer auth');
        dispatch({
          type: DEALER_AUTH,
          payload: response.data.token,
          name: response.data.user.name
        });
      } else {
        console.log('Dispatching regular user auth');
        dispatch({
          type: LOGIN_SUCCESS,
          payload: response.data.token,
          name: response.data.user.name
        });
      }
      return response.data;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    throw error;
  }
};

export const fetchregister = (payload) => async (dispatch) => {
  console.log('Register attempt with:', payload);
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, payload);
    console.log('Register response:', response.data);
    dispatch({ type: SIGNUP_SUCCESS });
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    throw error;
  }
};