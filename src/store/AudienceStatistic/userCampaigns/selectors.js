import { createSelector } from 'reselect';
import { getFocusRootData } from '../selectors';
import { CAMPAIGN_EXAMPLE_ID, ORDER_EXAMPLE_ID } from '../reportData/constants';

const __getFocusUserCampaigns = createSelector(getFocusRootData, data => data.userCampaigns);

const getUserCampaignsItems = createSelector(__getFocusUserCampaigns, data => data.items || []);
export const getUserCampaignsDataIsLoading = createSelector(__getFocusUserCampaigns, data => data.isLoading);

export const getHasCampaigns = createSelector(getUserCampaignsItems, items => items.length > 0);
export const getLastCampaign = createSelector(getUserCampaignsItems, items => items[items.length - 1] || {});

const getLastCampaignId = createSelector(getLastCampaign, campaign => String(campaign.id));
const getLastCampaignOrders = createSelector(getLastCampaign, campaign => campaign.orders);
const getLastCampaignOrder = createSelector(getLastCampaignOrders, orders => (orders ? orders[0] : {}));
const getLastCampaignOrderId = createSelector(getLastCampaignOrder, order => String(order.id));

export const getCampaignIdToViewPreviewReport = createSelector(
  getHasCampaigns, getLastCampaignId,
  (hasCampaigns, lastCampaignId) => (hasCampaigns ? lastCampaignId : CAMPAIGN_EXAMPLE_ID),
);

export const getOrderIdToViewPreviewReport = createSelector(
  getHasCampaigns, getLastCampaignOrderId,
  (hasCampaigns, lastCampaignOrderId) => (hasCampaigns ? lastCampaignOrderId : ORDER_EXAMPLE_ID),
);
