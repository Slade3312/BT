import { SET_COMMON_CONSTANTS } from './constants';

const initialState = {
  variables: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COMMON_CONSTANTS: {
      return {
        ...state,
        variables: action.payload,
      };
    }
    default:
      return state;
  }
};
