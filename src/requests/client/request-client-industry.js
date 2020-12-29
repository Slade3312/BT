import { axiosAuthorizedRequest } from '../helpers';
import { CLIENT_INDUSTRY_API_URL } from '../constants';

export const requestClientIndustry = () => axiosAuthorizedRequest({ url: CLIENT_INDUSTRY_API_URL });
