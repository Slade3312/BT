import { composeAxiosMutationRequest, composeAxiosPostRequest } from '../helpers';
import { getClientCheckPromoCode, SHORT_LINK_API_URL } from './constants';

export { requestClientIndustry } from './request-client-industry';

export const BEELINE_SHORT_LINK_URL = 'https://beel.ink/';
export const BEELINE_SHORT_LINK_FULL_LENGTH = 22;

export const requestShortLink = () =>
  composeAxiosPostRequest({ url: SHORT_LINK_API_URL });

export const requestCampaignPromocode = (campaignId, other) =>
  composeAxiosMutationRequest({
    url: getClientCheckPromoCode(campaignId),
  })({
    ...other,
  });
