import { createSelector } from 'reselect';
import { __getCommonData } from 'store/selectors';
import { data } from '../date';
import {
  COMPANY,
  COMPANY_INDUSTRY,
  COMPANY_POST_PAY,
  COMPANY_VOICE_TARGET_CLIENT_ID,
  EMAIL,
} from './constants';

export const getUserInfo = state => __getCommonData(state).userInfo;
export const getData = state => getUserInfo(state).data;
export const getIsLoadingData = state => getUserInfo(state).isLoading;

export const getUserId = state => getData(state).id;
export const getUserEmail = state => getData(state)[EMAIL];

export const getCompany = state => getData(state)[COMPANY] || {};
export const getIndustry = state => getCompany(state)[COMPANY_INDUSTRY];
export const getVoiceTargetClientId = state => getCompany(state)[COMPANY_VOICE_TARGET_CLIENT_ID];
export const getIsPostPay = state => getCompany(state)[COMPANY_POST_PAY];


const getOfferData = () => data.offerModal;

export const getOfferTitle = createSelector(getOfferData, offer => offer.title);
export const getOfferDescription = createSelector(getOfferData, offer => offer.description);
export const getOfferButtonText = createSelector(getOfferData, offer => offer.buttonText);
export const getOfferLabelText = createSelector(getOfferData, offer => offer.labelText);
