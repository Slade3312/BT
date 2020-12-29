import { axiosAuthorizedRequest } from '../helpers';
import { FEEDBACK_API_URL } from './constants';

export const requestFeedback = data =>
  axiosAuthorizedRequest({
    method: 'POST',
    url: FEEDBACK_API_URL,
    data,
  });
