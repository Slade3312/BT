import { SET_CAMPAIGN_CHANNEL_TYPES } from './constants';

const initialState = {
  channelTypes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CAMPAIGN_CHANNEL_TYPES: {
      return { ...state, channelTypes: action.payload };
    }
    default:
      return state;
  }
};
