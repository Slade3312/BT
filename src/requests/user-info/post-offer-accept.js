import { axiosAuthorizedRequest } from '../helpers';
import { USER_INFO_API_URL } from '../constants';

const getOfferAcceptedApiUrl = id => `${USER_INFO_API_URL}${id}/offer-accepted/`;

export const mutateOfferAccept = (id, email) =>
  axiosAuthorizedRequest({
    method: 'POST',
    url: getOfferAcceptedApiUrl(id),
    data: { email },
  });
