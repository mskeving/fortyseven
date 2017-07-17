export const LOAD = 'load/list';

const initialState = {
  loading: true
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

export const loadList = () => {
  return dispatch => {
    dispatch({ type: LOAD });
  }
};
