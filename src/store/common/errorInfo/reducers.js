import { CLEAR_GLOBAL_ERROR_DATA, SET_GLOBAL_ERROR_DATA } from './constants';

const initialState = {
  statusCode: null,
  type: null,
  message: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GLOBAL_ERROR_DATA: {
      const { statusCode, type, message } = action.payload;
      return {
        ...state,
        statusCode,
        type,
        message,
      };
    }
    case CLEAR_GLOBAL_ERROR_DATA:
      return initialState;
    default:
      return state;
  }
}
