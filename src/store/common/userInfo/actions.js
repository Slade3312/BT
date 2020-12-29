import { mutateOfferAccept } from 'requests/user-info';
import {
  SET_LOADING_USER_INFO,
  SET_USER_COMMON_INFO,
} from './constants';
import { getUserId } from './selector';

export const setUserCommonInfo = payload => ({
  type: SET_USER_COMMON_INFO,
  payload,
});

export const setUserCommonInfoLoading = payload => ({
  type: SET_LOADING_USER_INFO,
  payload,
});

export const acceptOffer = (email) => async (dispatch, getState) => {
  const state = getState();
  dispatch(setUserCommonInfoLoading(true));
  const userInfoId = getUserId(state);
  try {
    await mutateOfferAccept(userInfoId, email);
    window.location.reload();
  } catch (err) {
    dispatch(setUserCommonInfoLoading(false));
    throw err.response.data;
  }
};
