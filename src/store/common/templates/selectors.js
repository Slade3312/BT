import { createSelector } from 'reselect';
import { createDeepEqualSelector } from '../../utils';
import {
  commonDefault,
  dashboardDefault,
  userInfoDefault,
  myCampaignsDefault,
  newCampaignsDefault,
  audienceStatisticDefault,
  errorsDefault,
  notificationsDefault,
  popupsDefault,
} from './__defaultData';
import { deepMergeWithArraysByIndex } from './utils';

export const getDefaultTemplates = () => ({
  common: commonDefault,
  dashboard: dashboardDefault,
  userInfo: userInfoDefault,
  myCampaigns: myCampaignsDefault,
  newCampaign: newCampaignsDefault,
  audienceStatistic: audienceStatisticDefault,
  errors: errorsDefault,
  notifications: notificationsDefault,
  popups: popupsDefault,
});

export const getTemplates = state => state.templates;

export const getTemplatesByDefault = createSelector(
  getTemplates,
  getDefaultTemplates,
  (templates, defaultTemplates) => deepMergeWithArraysByIndex(defaultTemplates, templates),
);

export const getTemplatesCommon = createDeepEqualSelector(getTemplatesByDefault, data => data.common);
export const getTemplatesDashboard = createDeepEqualSelector(getTemplatesByDefault, data => data.dashboard);
export const getTemplatesUserInfo = createDeepEqualSelector(getTemplatesByDefault, data => data.userInfo);
export const getTemplatesFaq = createDeepEqualSelector(getTemplatesByDefault, data => data.faq);
export const getTemplatesNewCampaign = createDeepEqualSelector(getTemplatesByDefault, data => data.newCampaign);
export const getTemplatesMyCampaigns = createDeepEqualSelector(getTemplatesByDefault, data => data.myCampaigns);
export const getTemplatesNotifications = createDeepEqualSelector(getTemplatesByDefault, data => data.notifications);
export const getTemplatesPopups = createDeepEqualSelector(getTemplatesByDefault, data => data.popups);
export const getTemplatesAudienceStatistic = createDeepEqualSelector(
  getTemplatesByDefault,
  data => data.audienceStatistic,
);
