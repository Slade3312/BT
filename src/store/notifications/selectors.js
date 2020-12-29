import { SET_CAMPAIGN_NOTIFICATION_DATA, SET_PUSH_ANDROID_NOTIFICATION_DATA } from './constants';

const getNotifications = state => state.notifications || [];

// common selectors
export const getNotificationIsActive = id => state => getNotifications(state)[id].isActive;
export const getNotificationTimeoutID = (id, state) => getNotifications(state)[id].timeoutID;

export const getNotificationById = id => state => getNotifications(state)[id];
export const getNotificationData = id => state => getNotificationById(id)(state).data;

// campaign draft changed
export const getCampaignDraftSavedIsActive = state => getNotificationIsActive(SET_CAMPAIGN_NOTIFICATION_DATA.id)(state);

// push audience changed
export const getPushAudienceChangedIsActive = state =>
  getNotificationIsActive(SET_PUSH_ANDROID_NOTIFICATION_DATA.id)(state);
export const getPushAudienceChangedData = state => getNotificationData(SET_PUSH_ANDROID_NOTIFICATION_DATA.id)(state);
export const getPushAudienceChangedAudience = state => getPushAudienceChangedData(state).audience;
