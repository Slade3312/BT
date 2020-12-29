import { defaultMemoize, createSelectorCreator } from 'reselect';
import { isDeepEqual } from 'utils/isDeepEqual';
import { NEW_CAMPAIGN_CHANNELS } from './constants';

export const filterNewCampaignChannels = items =>
  items.filter(item => NEW_CAMPAIGN_CHANNELS.includes(item.channel_uid));

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isDeepEqual,
);
