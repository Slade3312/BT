import { createSelector } from 'reselect';
import htmlReactParser from 'html-react-parser';
import { formatPrice } from 'utils/formatting';
import { getPushAudienceChangedAudience } from 'store/notifications/selectors';
import { getTemplatesNotifications } from '../selectors';
import { deepTemplateTransformByContentType } from '../utils';

const getTemplateCampaignSavedDraft = state => getTemplatesNotifications(state).CampaignSavedDraft;
export const getTemplatePushAudienceChanged = state => getTemplatesNotifications(state).PushAudienceChanged;
const getDescriptionPushAudience = state => getTemplatePushAudienceChanged(state)?.description?.content;
const getTitleTypePushAudience = state => getTemplatePushAudienceChanged(state)?.title?.type;
const getDescriptionTypePushAudience = state => getTemplatePushAudienceChanged(state)?.description?.type;
const getTitlePushAudience = state => getTemplatePushAudienceChanged(state)?.title?.content;

export const getTitlePushAudienceNormalized = createSelector(
  getTitlePushAudience,
  getTitleTypePushAudience,
  (title, type) => {
    if (type === 'html') return htmlReactParser(title);
    return title;
  },
);

export const getPushAudienceDescriptionNormalized = createSelector(
  getDescriptionPushAudience,
  getPushAudienceChangedAudience,
  getDescriptionTypePushAudience,
  (description, audience, type) => {
    let formattedValue = '';
    if (description && audience) {
      const formattedAudience = formatPrice(audience);
      formattedValue = description.replace('{formattedAudience}', formattedAudience);
    }
    if (type === 'html') return htmlReactParser(formattedValue);
    return formattedValue;
  },
);

export const getTemplateCampaignSavedDraftNormalized = createSelector(
  getTemplateCampaignSavedDraft,
  deepTemplateTransformByContentType,
);

