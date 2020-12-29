import { SET_USER_CAMPAIGNS_DATA } from './constants';

export const setUserCampaignsItems = payload => ({ type: SET_USER_CAMPAIGNS_DATA, payload: payload.results });
