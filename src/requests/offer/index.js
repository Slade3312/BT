import { axiosAuthorizedRequest } from 'requests/helpers';

const OFFER_API_URL = '/api/v1/offer/';

export const requestOffer = () => axiosAuthorizedRequest({ url: OFFER_API_URL });
