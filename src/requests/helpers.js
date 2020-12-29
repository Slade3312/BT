import axios from 'axios';
import Cookies from 'js-cookie';
import Authorization from 'store/mobx/Authorization';

import { getStore } from 'store';
import { map } from 'utils/fn';
import { setGlobalErrorData } from 'store/common/errorInfo/actions';

/**
 * A base request with common params predefined
 * fully customizable, baseRequest is used to prevent boilerplate code generation
 * @returns {AxiosPromise}
 */
export const axiosBaseRequest = ({
  method = 'GET', url, responseType = 'json', withCredentials = true, headers, ...options
}) => axios({
  method,
  url,
  responseType,
  withCredentials,
  headers: {
    'X-CSRFToken': Cookies.get('marketeco_csrftoken'),
    ...headers,
  },
  ...options,
}).then(res => res.data);


const composeAuthorizedRequest = (request) => (data, { isIgnoreErrors } = {}) => {
  return request(data)
    .catch((err) => {
      const store = getStore();
      const { status: statusCode } = err.response;

      if (statusCode === 401) {
        return Authorization.setUnauthorized();
      } else if (!isIgnoreErrors && statusCode === 403) {
        store.dispatch(setGlobalErrorData({ statusCode, type: null }));
      }

      throw err;
    });
};

export const composeErrorCatchingRequest = request => data =>
  request(data).catch((err) => {
    const store = getStore();
    const { status: statusCode } = err.response;
    if (statusCode === 401) {
      return Authorization.setUnauthorized();
    }
    store.dispatch(setGlobalErrorData({
      statusCode,
      type: null,
    }));
    throw err;
  });


/**
 * Global store bound function that works with a store
 */
export const axiosAuthorizedRequest = composeAuthorizedRequest(axiosBaseRequest);

/**
 * Advanced request composer used to create POST/PUT requests, based on data provided
 * (checks if data contains `id` field to create a PUT request)
 * Takes same arguments as axiosBaseRequest (and axios lib)
 */
export const composeAxiosMutationRequest = ({ url, ...requestOptions }) =>
  data => axiosAuthorizedRequest({
    ...(data && data.id ? {
      method: 'PUT',
      url: `${url}${data.id}/`,
    } : {
      method: 'POST',
      url,
    }),
    ...requestOptions,
    data,
  });


/**
 * Advanced request composer used to create POST/PUT requests, based on data provided
 * (checks if data contains `id` field to create a PUT request)
 * Takes same arguments as axiosBaseRequest (and axios lib)
 */
export const composeAxiosUpdateRequest = requestOptions =>
  data => axiosAuthorizedRequest({
    method: 'PUT',
    ...requestOptions,
    data,
  });

export const composeAxiosMutationFileDataRequest = requestOptions =>
  data => axiosAuthorizedRequest({
    ...requestOptions,
    data: prepareMultipartFormData(data),
  });


export const composeAxiosDeleteRequest = requestOptions =>
  data => axiosAuthorizedRequest({
    method: 'DELETE',
    ...requestOptions,
    data,
  });

export const composeAxiosPostRequest = requestOptions =>
  axiosAuthorizedRequest({
    method: 'POST',
    ...requestOptions,
  });


/**
 * Allows uploading of files, as well as normal json data objects
 */
const prepareMultipartFormData = (data) => {
  const formData = new FormData();
  map(data, (value, key) => {
    if (value instanceof Blob) {
      formData.append(key, value, value.name);
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
