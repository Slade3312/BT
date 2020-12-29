import { SET_HOLIDAYS_SETTINGS } from './constants';

const initialState = {
  holidays: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_HOLIDAYS_SETTINGS:
      return {
        ...state,
        holidays: action.payload,
      };
    default:
      return state;
  }
}
