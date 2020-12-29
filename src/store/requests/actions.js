import { REQUEST_INPROGRESS, REQUEST_SUCCESS, REQUEST_ERROR } from 'store/constants';
import { SET_REQUEST_DATA, RESET_REQUEST_DATA } from './constants';

export const setRequestData = (key, data) => ({
  type: SET_REQUEST_DATA,
  payload: { key, data },
});

export const resetRequestData = key => ({
  type: RESET_REQUEST_DATA,
  payload: { key },
});

export const sendRequest = (request, { key, data }) => (dispatch) => {
  dispatch(setRequestData(key, { status: REQUEST_INPROGRESS }));
  request(data)
    .then(() => dispatch(setRequestData(key, { status: REQUEST_SUCCESS })))
    .catch(() => dispatch(setRequestData(key, { status: REQUEST_ERROR })));
};
