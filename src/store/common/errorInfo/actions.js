import { ERROR_NON_BLOCKING, SET_GLOBAL_ERROR_DATA, CLEAR_GLOBAL_ERROR_DATA } from './constants';

export const setGlobalErrorData = ({ statusCode, type, message }) => ({
  type: SET_GLOBAL_ERROR_DATA,
  payload: {
    statusCode,
    type,
    message,
  },
});

export const clearGlobalErrorData = () => ({ type: CLEAR_GLOBAL_ERROR_DATA });

export const setBadRequestErrorData = message => setGlobalErrorData({
  statusCode: 400,
  type: ERROR_NON_BLOCKING,
  message,
});
