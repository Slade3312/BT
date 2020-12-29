import { SET_TAXONS, SET_TAXONS_SUBGROUPS } from './constants';

const initialState = {
  list: [],
  subgroupsList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TAXONS:
      return {
        ...state,
        list: action.payload,
      };
    case SET_TAXONS_SUBGROUPS:
      return {
        ...state,
        subgroupsList: action.payload,
      };
    default: {
      return state;
    }
  }
}
