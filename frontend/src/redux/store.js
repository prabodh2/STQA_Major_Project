import { applyMiddleware, combineReducers, legacy_createStore, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as AuthReducer } from "./AuthReducer/reducer";
import { reducer as ProductReducer } from "./ProductReducer/reducer";

// Debugging middleware
const logger = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  return result;
};

// Create root reducer
const rootReducer = combineReducers({
  AuthReducer,
  ProductReducer
});

// Enable Redux DevTools
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Create store
export const store = legacy_createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);