/* api urls */
export const AUTH_REDIRECT_URL = '/authorize/';
export const USER_INFO_API_URL = '/api/v1/user-info/';
export const HOLIDAYS_SETTINGS_URL = '/api/v1/settings/holidays/';
export const WORK_HOURS_SETTINGS_URL = '/api/v1/settings/work-hours/';
export const CLIENT_INDUSTRY_API_URL = '/api/v1/client/industry/';
export const CHANNEL_TYPES_API_URL = '/api/v1/client/channel_types/';
export const REPORT_DATA_API_URL = '/api/v1/report/report_data/';
export const STATIC_URL = '/static/';
export const TEMPLATES_URL = '/api/v1/settings/templates/';
export const MANAGER_CAMPAIGN_CREATE = '/api/v1/client/campaigns/creation_request/';
export const POLLS_TARIFFS = '/api/v1/client/poll_tariffs/';
export const POLLS_CREATE = '/api/v1/client/campaigns/create_poll/';
export const getSmsOnlineGeoUrl = (campaignID) => `/api/v1/client/campaigns/${campaignID}/orders_audience/target-sms/`;
