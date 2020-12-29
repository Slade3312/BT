import { axiosAuthorizedRequest } from 'requests/helpers';
import { CONSTANTS_API_URL } from './constants';

export const requestConstants = () => axiosAuthorizedRequest({ url: CONSTANTS_API_URL });
