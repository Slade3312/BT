import { SET_USER_CAMPAIGNS_DATA, SET_USER_CAMPAIGNS_DATA_LOADING } from './constants';

const initialState = {
  items: [],
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_CAMPAIGNS_DATA: {
      return {
        ...state,
        items: action.payload,
      };
    }
    case SET_USER_CAMPAIGNS_DATA_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    default:
      return state;
  }
}
