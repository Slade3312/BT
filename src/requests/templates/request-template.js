import { axiosAuthorizedRequest } from '../helpers';
import { TEMPLATES_URL } from '../constants';

export const requestTemplate = templateName => axiosAuthorizedRequest({
  url: TEMPLATES_URL,
  params: { name: templateName },
});
