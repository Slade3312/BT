import { ACTIVITY_FIELD, ORDER_CONNECTION_TYPE, SET_CHANNEL_TYPES, WAY_TO_MAKE_CALL } from './constants';

const initialState = {
  list: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CHANNEL_TYPES:
      return {
        ...state,
        list: action.payload,
      };
    case ORDER_CONNECTION_TYPE:
      return {
        ...state,
        connectionTypes: action.payload,
      };
    case WAY_TO_MAKE_CALL:
      return {
        ...state,
        callMethods: action.payload,
      };
    case ACTIVITY_FIELD:
      return {
        ...state,
        activityFields: action.payload,
      };
    default: {
      return state;
    }
  }
}
