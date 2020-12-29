import {
  axiosAuthorizedRequest,
  composeAxiosDeleteRequest,
  composeAxiosMutationFileDataRequest,
  composeAxiosMutationRequest,
  composeAxiosPostRequest,
  composeAxiosUpdateRequest,
} from 'requests/helpers';

import { CHANNEL_TYPES_API_URL } from '../constants';
import {
  CAMPAIGN_API_URL,
  CAMPAIGN_AUDIENCE_PROFILING_API_URL,
  getCampaignApiUrl,
  getCampaignOrderApiUrl,
  getCampaignStartApiUrl,
  getSelectionApiUrl,
  getPushSelectionApiUrl,
  getCampaignSendInternetBriefById,
} from './constants';

export const getCampaignRequest = campaignId =>
  axiosAuthorizedRequest({ url: getCampaignApiUrl(campaignId) });

export const mutateCampaignRequest = (...args) => composeAxiosMutationRequest({ url: CAMPAIGN_API_URL })(...args);

export const setSelectionRequest = ({ campaignId, ...data }) =>
  composeAxiosUpdateRequest({ url: getSelectionApiUrl({ campaignId }) })(data);

export const requestPushRestrictedAudience = ({ campaignId }) =>
  axiosAuthorizedRequest({ method: 'POST', url: getPushSelectionApiUrl({ campaignId }) });

export const putOrderRequest = ({ campaignId, channelType, data }) =>
  composeAxiosUpdateRequest({
    url: getCampaignOrderApiUrl({ campaignId, channelType }),
  })(data);

export const startCampaignRequest = ({ campaignId, locations, onlyValid, promocodes }) =>
  composeAxiosPostRequest({
    url: getCampaignStartApiUrl(campaignId),
    data: {
      locations,
      only_valid: onlyValid,
      promo_codes: promocodes,
    },
  });

export const requestRemoveCampaignById = campaignId =>
  composeAxiosDeleteRequest({ url: getCampaignApiUrl(campaignId) })();

export const createAudienceProfiling = data =>
  composeAxiosPostRequest({ url: CAMPAIGN_AUDIENCE_PROFILING_API_URL, data });

export const requestChannelTypes = () => axiosAuthorizedRequest({ url: CHANNEL_TYPES_API_URL });

export const briefQuestionRequest = ({ data, campaignId }) =>
  composeAxiosPostRequest({
    url: `${getCampaignApiUrl(campaignId)}mediaplan_comment/`,
    data: { question: data },
  });

export const postSendInternetBrief = id =>
  composeAxiosMutationRequest({
    url: getCampaignSendInternetBriefById(id),
  })();

export const customSegmentRequest = ({ data, campaignId, segmentId }) =>
  composeAxiosUpdateRequest({
    url: `${getCampaignApiUrl(campaignId)}custom_segment/${segmentId}/`,
  })(data);

export const customSegmentLoadFileRequest = ({ data: dataBlob, campaignId, segmentId, event_depth }) =>
  composeAxiosMutationFileDataRequest({
    url: `${getCampaignApiUrl(campaignId)}custom_segment/${segmentId}/files/`,
    method: 'POST',
  })({ file: dataBlob, event_depth });

export const customSegmentDeleteFileRequest = ({ fileId, campaignId, customSegmentId }) =>
  composeAxiosDeleteRequest({
    url: `${getCampaignApiUrl(campaignId)}custom_segment/${customSegmentId}/files/${fileId}`,
  });

export const customSegmentDeleteAllFilesRequest = ({ campaignId, customSegmentId }) =>
  composeAxiosDeleteRequest({
    url: `${getCampaignApiUrl(campaignId)}custom_segment/${customSegmentId}/files/`,
  });
