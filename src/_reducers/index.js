import { combineReducers } from 'redux';
import bucketReducer from './bucket.reducer';

const appReducer = combineReducers({
  bucketReducer,
});
const rootReducer = (state, action) => {
  return appReducer(state, action);
};
export default rootReducer;
