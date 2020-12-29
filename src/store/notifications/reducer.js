import {
  SET_CAMPAIGN_NOTIFICATION_DATA,
  SET_PUSH_ANDROID_NOTIFICATION_DATA,
} from 'store/notifications/constants';

const initialState = {
  campaign: {
    isActive: false,
    timeoutID: null,
  },
  android: {
    isActive: false,
    timeoutID: null,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CAMPAIGN_NOTIFICATION_DATA.type:
      return {
        ...state,
        campaign: action.payload,
      };
    case SET_PUSH_ANDROID_NOTIFICATION_DATA.type:
      return {
        ...state,
        android: action.payload,
      };
    default:
      return state;
  }
}
