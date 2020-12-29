import {
  SET_CLIENT_INDUSTRY,
} from './constants';

export const setClientIndustry = payload => ({
  type: SET_CLIENT_INDUSTRY,
  payload,
});
