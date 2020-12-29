import { SET_INDUSTRIES, SET_TOOLS } from './constants';

const initialState = {
  industries: [],
  tools: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INDUSTRIES:
      return {
        ...state,
        industries: action.payload,
      };
    case SET_TOOLS:
      return {
        ...state,
        tools: action.payload,
      };
    default: {
      return state;
    }
  }
}
