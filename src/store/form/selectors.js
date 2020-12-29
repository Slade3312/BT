import { USER_INFO_FORM } from 'pages/UserInfo/components/UserInfoForm/constants';
import { REPORT_FILTER_FORM } from 'pages/AudienceStatistic/components/ReportFilter/constants';
import { MY_CAMPAIGNS_FILTER_FORM } from '../MyCampaigns/constants';
import { FOCUS_CAMPAIGN_FORM } from '../AudienceStatistic/campaignSteps/constants';

export const __getForm = state => state.form;
export const getUserInfoForm = state => __getForm(state)[USER_INFO_FORM] || {};
export const getUserInfoFormValues = state => getUserInfoForm(state).values || {};

export const getReportsFilterForm = state => __getForm(state)[REPORT_FILTER_FORM] || {};
export const getReportsFilterFormValues = state => getReportsFilterForm(state).values || {};

export const getMyCampaignsFilterForm = state => __getForm(state)[MY_CAMPAIGNS_FILTER_FORM] || {};
export const getMyCampaignsFiltersFormValues = state => getMyCampaignsFilterForm(state).values || {};

export const getFocusCampaignForm = state => __getForm(state)[FOCUS_CAMPAIGN_FORM] || {};
export const getFocusCampaignFormValues = state => getFocusCampaignForm(state).values || {};
