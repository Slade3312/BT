import { SET_CLIENT_INDUSTRY } from './constants';

const initialState = {
  industry: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT_INDUSTRY: {
      return {
        ...state,
        industry: action.payload,
      };
    }
    default:
      return state;
  }
};
