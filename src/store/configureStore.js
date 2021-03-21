import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../_reducers";

function configureStoreProd(initialState) {
  //   const middlewares = [thunk];

  //   const composeEnhancers =
  //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}

const configureStore = configureStoreProd;
export default configureStore;
