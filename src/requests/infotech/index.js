import { axiosAuthorizedRequest } from '../helpers';

const INFOTECH_INDUSTRIES_API_URL = '/api/v1/infotech/industries/';
const INFOTECH_TOOLS_API_URL = '/api/v1/infotech/tools/';

export const requestInfotechIndustries = () => axiosAuthorizedRequest({ url: INFOTECH_INDUSTRIES_API_URL });
export const requestInfotechTools = () => axiosAuthorizedRequest({ url: INFOTECH_TOOLS_API_URL });
