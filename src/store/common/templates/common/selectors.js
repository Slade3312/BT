import { createSelector } from 'reselect';
import { formatPhone } from 'utils/formatting';
import { getTemplatesCommon } from '../selectors';
import { deepTemplateTransformByContentType } from '../utils';

export const getTemplateCommonTransformed = createSelector(
  getTemplatesCommon,
  deepTemplateTransformByContentType,
);

export const getFeedbackBanner = state => getTemplateCommonTransformed(state).FeedbackBanner;
export const getFeedbackBannerTitle = state => getFeedbackBanner(state)?.title;
export const getFeedbackBannerDescription = state => getFeedbackBanner(state)?.description;
export const getFeedbackBannerBackgroundImage = state => getFeedbackBanner(state)?.backgroundImage;
export const getFeedbackBannerButtonText = state => getFeedbackBanner(state)?.button;
export const getFeedbackBannerPhone = state => getFeedbackBanner(state)?.phone;
export const getFormattedPhone = state => (
  getFeedbackBannerPhone(state) ? formatPhone(getFeedbackBannerPhone(state)) : ''
);

export const getFooter = state => getTemplateCommonTransformed(state).Footer;
export const getFooterDescription = state => getFooter(state)?.description;
export const getFooterLinksGroups = state => getFooter(state)?.linksGroups.items;
export const getFooterSocials = state => getFooter(state)?.socials.items;

export const getFeedbackSuccessPopup = state => getTemplateCommonTransformed(state).FeedbackSuccessPopup;
export const getFeedbackErrorPopup = state => getTemplateCommonTransformed(state).FeedbackErrorPopup;
