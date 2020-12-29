export const CAMPAIGN_NAME_FIELD = 'name';

/* api urls */
export const CAMPAIGN_API_URL = '/api/v1/client/campaigns/';

export const CAMPAIGN_AUDIENCE_PROFILING_API_URL = `${CAMPAIGN_API_URL}create_audience_profiling/`;

export const getCampaignApiUrl = campaignId => `${CAMPAIGN_API_URL}${campaignId}/`;

export const getCampaignOrderApiUrl = ({ campaignId, channelType }) =>
  `${CAMPAIGN_API_URL}${campaignId}/orders/${channelType}/`;

export const getSelectionApiUrl = ({ campaignId }) => `${CAMPAIGN_API_URL}${campaignId}/selection/`;

export const getPushSelectionApiUrl = ({ campaignId }) => `${CAMPAIGN_API_URL}${campaignId}/orders_audience/push/`;

export const getCampaignStartApiUrl = campaignId => `${CAMPAIGN_API_URL}${campaignId}/start/`;

export const getCampaignDownloadCtnCsv = campaignId => `${CAMPAIGN_API_URL}${campaignId}/download_ctn_csv/`;

export const getCampaignSendInternetBriefById = id => `${CAMPAIGN_API_URL}${id}/send_internet_brief/`;

export const CAMPAIGN_SORT_PARAMS = {
  DATE_START_ASC: 'date_start',
  DATE_START_DESC: '-date_start',
  CREATE_DATE_ASC: 'create_date',
  CREATE_DATE_DESC: '-create_date',
};
