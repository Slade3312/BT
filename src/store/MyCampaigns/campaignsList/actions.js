import {
  SET_MY_CAMPAIGNS_LIST_DATA,
  SET_MY_CAMPAIGNS_LIST_LOADING,
  OMIT_ORDER_FROM_CAMPAIGN,
  OMIT_CAMPAIGN_FROM_LIST,
} from '../constants';

export const setMyCampaignsListData = ({ items, totalCount, pageNumber }) => ({
  type: SET_MY_CAMPAIGNS_LIST_DATA,
  payload: { items, totalCount, pageNumber },
});

export const setMyCampaignsDataLoading = payload => ({ type: SET_MY_CAMPAIGNS_LIST_LOADING, payload });

export const omitOrderFromCampaignByIds = ({ campaignId, orderId } = {}) => (
  { type: OMIT_ORDER_FROM_CAMPAIGN, payload: { campaignId, orderId } }
);

export const omitCampaignFromList = campaignId => ({ type: OMIT_CAMPAIGN_FROM_LIST, payload: { campaignId } });
