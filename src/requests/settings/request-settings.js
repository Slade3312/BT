import { HOLIDAYS_SETTINGS_URL } from '../constants';
import { axiosAuthorizedRequest } from '../helpers';

export const requestHolidaysSettings = () =>
  axiosAuthorizedRequest({ url: HOLIDAYS_SETTINGS_URL });
