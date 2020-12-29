import { createSelector } from 'reselect';
import { convertListToObjectBy } from 'utils/fn';
import {
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_VOICE,
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_TARGET_INTERNET,
} from 'constants/index';
import { __getCommonData } from 'store/selectors';
import { EMPTY_OBJECT } from '../../constants';

export const getCommonCampaign = state => __getCommonData(state).campaign || [];
export const getCommonCampaignChannelTypesList = state => getCommonCampaign(state).channelTypes || [];
export const getCommonCampaignChannelTypesById = createSelector(
  getCommonCampaignChannelTypesList,
  convertListToObjectBy('channel_uid'),
);

export const getSmsChannelTypesData = createSelector(
  getCommonCampaignChannelTypesById,
  data => data[CHANNEL_STUB_SMS] || EMPTY_OBJECT,
);
export const getInternetChannelTypesData = createSelector(
  getCommonCampaignChannelTypesById,
  data => data[CHANNEL_STUB_INTERNET] || EMPTY_OBJECT,
);
export const getPushChannelTypesData = createSelector(
  getCommonCampaignChannelTypesById,
  data => data[CHANNEL_STUB_PUSH] || EMPTY_OBJECT,
);
export const getVoiceChannelTypesData = createSelector(
  getCommonCampaignChannelTypesById,
  data => data[CHANNEL_STUB_VOICE] || EMPTY_OBJECT,
);
export const getSocialChannelTypesData = createSelector(
  getCommonCampaignChannelTypesById,
  data => data[CHANNEL_STUB_TARGET_INTERNET] || EMPTY_OBJECT,
);
