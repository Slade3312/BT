import { axiosAuthorizedRequest, composeAxiosPostRequest } from '../helpers';
import {
  CLIENT_ORDERS_STATUSES_API_URL,
  ORDERS_CALCULATE_API_URL,
  getActiveChangeUrl,
  VOICE_CONNECTION_TYPES_API_URL,
  VOICE_INDUSTRIES_API_URL,
  VOICE_CALL_METHODS_API_URL,
} from './constants';

export const calculateOrderEventsRequest = data =>
  axiosAuthorizedRequest({
    method: 'POST',
    url: ORDERS_CALCULATE_API_URL,
    data,
  });

export const requestOrdersStatuses = () =>
  axiosAuthorizedRequest({ url: CLIENT_ORDERS_STATUSES_API_URL });

export const changeOrderIsActiveRequest = data =>
  composeAxiosPostRequest({
    url: getActiveChangeUrl(data.id),
    data: {
      is_active: data.is_active,
    },
  });

export const requestVoiceConnectionTypes = () =>
  axiosAuthorizedRequest({ url: VOICE_CONNECTION_TYPES_API_URL });

export const requestVoiceCallMethods = () =>
  axiosAuthorizedRequest({ url: VOICE_CALL_METHODS_API_URL });

export const requestVoiceIndustriesTariffs = () =>
  axiosAuthorizedRequest({ url: VOICE_INDUSTRIES_API_URL });
