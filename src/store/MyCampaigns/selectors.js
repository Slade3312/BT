import { createSelector } from 'reselect';
import { filterNewCampaignChannels } from '../utils';
import { getNewCampaignData } from '../selectors';
import { getMyCampaignsFiltersFormValues } from '../form/selectors';

export const getChannelsData = state => getNewCampaignData(state).channels;
const getChannelsList = state => getChannelsData(state).list || [];

export const getActivityFields = state => getChannelsData(state).activityFields;

export const getNewCampaignChannels = createSelector(
  getChannelsList,
  filterNewCampaignChannels,
);

const DEFAULT_OPTION = { value: null, label: 'Все каналы' };

export const getChannelsOptions = createSelector(
  getChannelsList,
  list => [DEFAULT_OPTION, ...list.map(item => ({ label: item.name, value: item.channel_type_id }))],
);

export const getMyCampaignsFiltersQuery = createSelector(
  getMyCampaignsFiltersFormValues,
  values => values,
);
