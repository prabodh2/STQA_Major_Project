import axios from "axios";
import {
  CAR_FAILURE,
  CAR_REQUEST,
  DELETE_CAR_SUCCESS,
  EDIT_CAR_SUCCESS,
  GET_CAR_SUCCSESS,
  ADD_CAR_SUCCESS
} from "./actionType";
import { transformCarsData } from "../../utils/imageUtils";

const BASE_URL = "http://localhost:4000";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log('Current token:', token);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    if (error.response.status === 401) {
      // Handle authentication error
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Error setting up request:', error.message);
  }
  throw error;
};

export const getCars = (params = {}) => async (dispatch) => {
  console.log('getCars action called with params:', params);
  dispatch({ type: CAR_REQUEST });
  
  try {
    // Build query string only for defined params
    const queryParams = new URLSearchParams();
    if (params.price) queryParams.append('price', params.price);
    if (params.color) queryParams.append('color', params.color);
    if (params.mileage) queryParams.append('mileage', params.mileage);

    const queryString = queryParams.toString();
    const endpoint = `${BASE_URL}/inventory/cars${queryString ? `?${queryString}` : ''}`;

    console.log('Making API request to:', endpoint);
    console.log('With headers:', getAuthHeaders());

    const response = await axios.get(endpoint, {
      headers: getAuthHeaders(),
      timeout: 5000 // 5 second timeout
    }).catch(error => {
      console.error('Axios error:', error);
      throw error;
    });

    console.log('Raw API response:', response);

    if (!response || !response.data) {
      console.error('Empty response or no data');
      throw new Error('Empty response or no data');
    }

    console.log('Response data:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format: expected array');
    }

    // Transform car data to handle image URLs
    const transformedCars = await transformCarsData(response.data);
    console.log('Transformed cars:', transformedCars);

    dispatch({ type: GET_CAR_SUCCSESS, payload: transformedCars });
    return transformedCars;
  } catch (error) {
    console.error('Error in getCars:', error);
    dispatch({ type: CAR_FAILURE, payload: { message: error.message } });
    handleApiError(error);
    return [];
  }
};

export const editCar = (payload, id) => (dispatch) => {
  console.log('editCar action called with payload:', payload, 'and id:', id);
  dispatch({ type: CAR_REQUEST });
  return axios
    .patch(`${BASE_URL}/inventory/edit-car/${id}`, payload, {
      headers: getAuthHeaders(),
    })
    .then((res) => {
      console.log('Raw API response:', res);
      dispatch({ type: EDIT_CAR_SUCCESS });
      console.log(res.data);
      return res.data;
    })
    .catch(error => {
      console.error('Axios error:', error);
      throw error;
    });
};

export const deleteCar = (id) => (dispatch) => {
  console.log('deleteCar action called with id:', id);
  dispatch({ type: CAR_REQUEST });
  return axios
    .delete(`${BASE_URL}/inventory/delete-car/${id}`, {
      headers: getAuthHeaders(),
    })
    .then((res) => {
      console.log('Raw API response:', res);
      dispatch({ type: DELETE_CAR_SUCCESS });
      console.log(res.data);
      return res.data;
    })
    .catch(error => {
      console.error('Axios error:', error);
      throw error;
    });
};

export const addCar = (payload) => async (dispatch) => {
  console.log('Adding car with payload:', payload);
  dispatch({ type: CAR_REQUEST });
  
  try {
    const response = await axios.post(`${BASE_URL}/inventory/add-car`, payload, {
      headers: getAuthHeaders(),
    });
    
    console.log('Raw API response:', response);
    console.log('Server response:', response.data);
    
    dispatch({ type: ADD_CAR_SUCCESS });
    return response.data;
  } catch (error) {
    console.error('Error in addCar:', error);
    dispatch({ 
      type: CAR_FAILURE, 
      payload: { message: error.response?.data?.message || error.message } 
    });
    throw error;
  }
};
