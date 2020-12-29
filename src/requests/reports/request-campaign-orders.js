import qs from 'query-string';
import { CHANNEL_TYPE_FOCUS_TYPE_ID } from 'pages/AudienceStatistic/constants';
import { MY_CAMPAIGNS_DEFAULT_CHANNEL_TYPES, MY_CAMPAIGNS_LIST_PAGE_SIZE } from 'store/MyCampaigns/constants';
import { REPORT_LIST_PAGE_SIZE } from 'store/AudienceStatistic/campaignsList/constants';

import { REPORT_DATA_API_URL } from '../constants';
import { axiosAuthorizedRequest, composeAxiosDeleteRequest } from '../helpers';
import { CAMPAIGN_API_URL, CAMPAIGN_SORT_PARAMS, getCampaignApiUrl } from '../campaigns/constants';

export const requestCampaignOrders = ({ params }) =>
  axiosAuthorizedRequest({
    url: CAMPAIGN_API_URL,
    params,
    paramsSerializer: gettedParams => qs.stringify(gettedParams),
  });

export const requestCampaignDelete = ({ campaignId }) =>
  composeAxiosDeleteRequest({ url: getCampaignApiUrl(campaignId) })();

export const requestCampaignsFocusOrders = ({ params, offset }) => {
  const reqParams = {
    offset,
    limit: REPORT_LIST_PAGE_SIZE,
    channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID,
    sort: CAMPAIGN_SORT_PARAMS.CREATE_DATE_DESC,
    ...(params || {}),
  };
  return requestCampaignOrders({ params: reqParams });
};

export const requestFirstCampaignsFocusOrders = () =>
  requestCampaignOrders({ params: { channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID, limit: 2, offset: 0 } });

export const requestMyCampaignsOrders = ({ params, offset }) => {
  const reqParams = {
    offset,
    limit: MY_CAMPAIGNS_LIST_PAGE_SIZE,
    channel_type: MY_CAMPAIGNS_DEFAULT_CHANNEL_TYPES,
    sort: CAMPAIGN_SORT_PARAMS.CREATE_DATE_DESC,
    ...(params || {}),
  };

  return requestCampaignOrders({ params: reqParams });
};

export const requestCampaignById = campaignId =>
  axiosAuthorizedRequest({
    url: getCampaignApiUrl(campaignId),
  });

export const requestReportDataById = id =>
  axiosAuthorizedRequest({
    url: REPORT_DATA_API_URL,
    params: { order: id },
  });

export const requestDefaultReport = () =>
  axiosAuthorizedRequest({
    url: REPORT_DATA_API_URL,
  });
