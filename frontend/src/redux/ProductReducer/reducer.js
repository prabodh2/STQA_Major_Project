import { 
  CAR_FAILURE, 
  CAR_REQUEST, 
  DELETE_CAR_SUCCESS, 
  EDIT_CAR_SUCCESS, 
  GET_CAR_SUCCSESS,
  ADD_CAR_SUCCESS
} from "./actionType";

const initialState = {
  isLoading: false,
  cars: [],
  isError: false,
  change: false,
  errorMessage: null
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CAR_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: null
      };

    case CAR_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: payload?.message || 'An error occurred'
      };

    case GET_CAR_SUCCSESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        cars: Array.isArray(payload) ? payload : [],
        errorMessage: null
      };

    case DELETE_CAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        change: !state.change,
        errorMessage: null
      };

    case EDIT_CAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        change: !state.change,
        errorMessage: null
      };

    case ADD_CAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        change: !state.change,
        errorMessage: null
      };

    default:
      return state;
  }
};