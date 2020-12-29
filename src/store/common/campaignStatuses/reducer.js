import { SET_CAMPAIGN_STATUSES } from './constants';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CAMPAIGN_STATUSES: {
      return action.payload;
    }
    default:
      return state;
  }
};
