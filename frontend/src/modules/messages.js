import { apiGet } from 'lib/api';
export const LOAD = 'load/messages';

const initialState = {
  loading: true
};

export const loadMessages = () => {
  return async dispatch => {
    const messages = await apiGet('api/messages', { limit: 20 });
    dispatch({ type: LOAD, messages });
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
