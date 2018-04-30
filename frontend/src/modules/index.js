import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import messages from 'modules/messages'

export default combineReducers({
  messages,
  routing: routerReducer
});
