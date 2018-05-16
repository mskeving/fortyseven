import {apiGet} from 'lib/api';
export const LOAD = 'load/messages';

const initialState = {
  loading: true,
};

export const loadMessageActivity = () => {
  return async dispatch => {
    const {date_to_count} = await apiGet('api/activity', {limit: 20});
    dispatch({type: LOAD, activity: date_to_count});
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: false,
        activity: action.activity,
      };
    default:
      return state;
  }
};
