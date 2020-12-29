import { USER_INFO_API_URL } from '../constants';
import { axiosAuthorizedRequest } from '../helpers';

export const requestUserInfo = (data = {}) =>
  axiosAuthorizedRequest({ url: USER_INFO_API_URL, ...data });
