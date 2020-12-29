import { createSelector } from 'reselect';

import { convertListToObjectBy } from 'utils/fn';
import { getNewCampaignChannels } from '../MyCampaigns/selectors';

export const getChannelsListMap = createSelector(
  getNewCampaignChannels,
  convertListToObjectBy('channel_uid'),
);
