import { createSelector } from 'reselect';
import { getTemplatesMyCampaigns } from '../selectors';
import { deepTemplateTransformByContentType } from '../utils';

export const getTemplateMyCampaignsTransformed = createSelector(
  getTemplatesMyCampaigns,
  deepTemplateTransformByContentType,
);

export const getMainHeading = state => getTemplateMyCampaignsTransformed(state).MainHeading;
export const getMainHeadingTitle = state => getMainHeading(state).title;
export const getMainHeadingDescription = state => getMainHeading(state).description;

export const getTopFilterPanel = state => getTemplateMyCampaignsTransformed(state).TopFilterPanel;
export const getTopFilterPanelButtonTitle = state => getTopFilterPanel(state).buttonTitle;
