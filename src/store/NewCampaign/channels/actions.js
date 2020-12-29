import { filterNewCampaignChannels } from 'store/utils';
import { setCampaignChannelTypes } from '../../common/campaign/actions';
import { ACTIVITY_FIELD, ORDER_CONNECTION_TYPE, SET_CHANNEL_TYPES, WAY_TO_MAKE_CALL } from './constants';
import { convertLegacyChannel } from './utils';

const setChannelTypes = payload => ({ type: SET_CHANNEL_TYPES, payload });

export const setCampaignAndCommonChannelTypes = payload => (dispatch) => {
  const newCampaignChannels = filterNewCampaignChannels(payload);
  const preparedData = newCampaignChannels.map(convertLegacyChannel);
  // TODO remove this old, now it's inside common data
  dispatch(setChannelTypes(preparedData));
  dispatch(setCampaignChannelTypes(payload));
};

export const setVoiceConnectionTypes = payload => ({ type: ORDER_CONNECTION_TYPE, payload });
export const setVoiceCallMethods = payload => ({ type: WAY_TO_MAKE_CALL, payload });
export const setVoiceIndustries = payload => ({ type: ACTIVITY_FIELD, payload });
