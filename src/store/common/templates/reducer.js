import { SET_TEMPLATE } from './constants';

const initialState = {
  common: {},
  dashboard: {},
  userInfo: {},
  faq: {},
  newCampaign: {},
  myCampaigns: {},
  audienceStatistic: {},
  notifications: {},
  popups: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TEMPLATE: {
      const { payload: { name, data } } = action;

      return {
        ...state,
        [name]: data,
      };
    }
    default:
      return state;
  }
};
