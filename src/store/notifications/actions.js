import { getNotificationShowTime } from 'store/common/commonConstants/selector';
import { getNotificationTimeoutID } from './selectors';
import { SET_CAMPAIGN_NOTIFICATION_DATA, SET_PUSH_ANDROID_NOTIFICATION_DATA } from './constants';

const setNotificationDataAction = (notification, data, isActive, timeoutID) => ({
  type: notification.type,
  payload: {
    isActive,
    timeoutID,
    data,
  },
});

export const setCampaignNotificationData = (notification, data, isActive) => async (dispatch, getState) => {
  const state = getState();
  const currentHideTimeout = getNotificationTimeoutID(notification.id, state);

  // Reset timeouts for prevent notification blinking
  if (currentHideTimeout) {
    clearTimeout(currentHideTimeout);
  }

  const timeoutID = setTimeout(() => {
    dispatch(setNotificationDataAction(notification, data, false));
  }, getNotificationShowTime(state) * 1000);

  dispatch(setNotificationDataAction(notification, data, isActive, timeoutID));
};

export const pushNotification = (notification, data) => dispatch =>
  dispatch(setCampaignNotificationData(notification, data, true));

export const popNotification = notification => setCampaignNotificationData(notification, {}, false);

export const popCampaignSavedDraftNotification = () => popNotification(SET_CAMPAIGN_NOTIFICATION_DATA);
export const popPushAudienceChangedNotification = () => popNotification(SET_PUSH_ANDROID_NOTIFICATION_DATA);
