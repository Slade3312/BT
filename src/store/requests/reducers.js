import { filter } from 'utils/fn';
import { SET_REQUEST_DATA, RESET_REQUEST_DATA } from './constants';

export default function (state = {}, action) {
  switch (action.type) {
    case SET_REQUEST_DATA: {
      const { key, data } = action.payload;
      const requestData = state[key] || {};
      return { ...state, [key]: { ...requestData, ...data } };
    }
    case RESET_REQUEST_DATA: {
      const { key } = action.payload;
      return filter(state, (_, requestKey) => requestKey !== key);
    }
    default:
      return state;
  }
}
