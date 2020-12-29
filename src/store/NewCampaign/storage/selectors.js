import { createSelector } from 'reselect';

import { filter } from 'utils/fn';
import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_SMS } from 'constants/index';
import { getNewCampaignData } from '../../selectors';
import { NEW_CAMPAIGN_CHANNELS, EMPTY_OBJECT } from '../../constants';

export const getStorageData = state => getNewCampaignData(state).storage || {};

const getOrdersData = state => getStorageData(state).channels || {};

export const getCampaignData = state => getStorageData(state).campaign || {};
export const getTaxonomyData = state => getStorageData(state).taxons || {};

// DO NOT USE IT, PLEASE or either you catch a bug! USE useGetCampaignOrderForms instead!
// this selector doesn't contain all forms, because some orderForm are inside MobX instances
export const getNewCampaignOrdersData = createSelector(
  getOrdersData,
  data => filter(data, (value, key) => NEW_CAMPAIGN_CHANNELS.includes(key)),
);

export const getCampaignInternetOrderData = createSelector(
  getNewCampaignOrdersData,
  data => data[CHANNEL_STUB_INTERNET] || EMPTY_OBJECT,
);

export const getToolsEvents = formData => formData?.toolsEvents || {};
export const getTotalEvents = formData => formData?.totalEvents || {};

export const getTotalBudgetBySelectedTools = tools =>
  (tools || []).reduce((acc, tool) => (tool.isActive && tool.budget ? acc + tool.budget : acc), 0);

export const getChannelIsChecked = formData => formData.isActive;

export const getGeoPoints = state => getTaxonomyData(state).geo_points || [];

export const getOrderTargetSmsData = createSelector(
  getNewCampaignOrdersData,
  channelsData => channelsData[CHANNEL_STUB_SMS] || {},
);

export const getTargetSmsFilesList = createSelector(
  getOrderTargetSmsData,
  smsChannelData => smsChannelData.files || [],
);

export const getTargetSmsOrderId = createSelector(
  getOrderTargetSmsData,
  smsChannelData => smsChannelData.id,
);

export const getActiveChannelIds = createSelector(
  [getNewCampaignOrdersData],
  ordersDict => Object.keys(filter(ordersDict, item => item.isActive)),
);

/**
 * `getTaxonomyData` value data format may be changed,
 * while this selector format is fixed to { [name]: value }
 */
export const getTaxonValuesByName = getTaxonomyData;

export const getCampaignEntityData = createSelector(
  getCampaignData,
  ({ id, budget, goal, ...campaignEntityData }) => ({
    ...(id ? { id } : {}),
    ...campaignEntityData,
  }),
);

export const getCurrentCampaignId = state => getCampaignData(state).id;
