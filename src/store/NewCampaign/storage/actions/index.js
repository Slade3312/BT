import { calculateOrderEventsRequest } from 'requests/orders';
import { deleteOrderFile } from 'requests/client/upload-order-file';
import NewCampaign from 'store/mobx/NewCampaign';
import Social from 'store/mobx/Social';
import {
  getCurrentCampaignId,
  getGeoPoints,
  getTargetSmsFilesList,
  getTargetSmsOrderId,
} from 'store/NewCampaign/storage/selectors';

import {
  RESET_STORAGE_DATA,
  SET_CAMPAIGN_ID,
  SET_ORDER_EVENTS,
  SET_ORDER_ID,
  SET_ORDER_IS_EMPTY,
  TOGGLE_CHANNEL,
  SET_ORDER_BUDGET,
} from 'store/NewCampaign/constants';

import { getSelectionId } from 'store/NewCampaign/controls/selectors';
import { pushNotification } from 'store/notifications/actions';
import { requestPushRestrictedAudience } from 'requests/campaigns';
import { SET_PUSH_ANDROID_NOTIFICATION_DATA } from 'store/notifications/constants';
import { SET_PUSH_SELECTION_DATA } from 'store/NewCampaign/controls/constants';
import { setSelectionIsLoading } from 'store/NewCampaign/controls/actions';
import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_PUSH, CHANNEL_STUB_SMS, CHANNEL_STUB_VOICE } from 'constants/index';
import { getPushToDtoInternetEventsData, getSmsToDtoInternetEventsData, getViewToDtoInternetEventsData } from './utils';

export const setCampaignId = payload => ({
  type: SET_CAMPAIGN_ID,
  payload,
});

export const setPushSelection = payload => ({
  type: SET_PUSH_SELECTION_DATA,
  payload,
});

export const syncPushAudience = () => async (dispatch, getState) => {
  const campaignId = getCurrentCampaignId(getState());

  dispatch(setSelectionIsLoading(true));

  try {
    const data = await requestPushRestrictedAudience({ campaignId });

    if (data.audience !== null) {
      dispatch(pushNotification(SET_PUSH_ANDROID_NOTIFICATION_DATA, data));
      dispatch(setPushSelection({
        audience: data.audience,
        isActive: true,
      }));
    }
  } finally {
    dispatch(setSelectionIsLoading(false));
  }
};

export const offPushAudienceRestriction = () => async (dispatch) => {
  dispatch(setPushSelection({
    isActive: false,
    audience: 10,
  }));
};

export const collectCitiesArray = geoPoints => geoPoints.map(item => item.city).filter(item => item);

const ALLOW_CHANNELS_TO_CALCULATE = [CHANNEL_STUB_SMS, CHANNEL_STUB_PUSH, CHANNEL_STUB_INTERNET, CHANNEL_STUB_VOICE];

export const setOrderEventsCount = ({ channelType, budget }) => async (dispatch, getState) => {
  if (!ALLOW_CHANNELS_TO_CALCULATE.includes(channelType)) {
    return;
  }

  const state = getState();
  const selectionId = getSelectionId(state);
  const geoPoints = getGeoPoints(state);

  const campaignId = Number(window.location.pathname.split('/')[2]);

  if (!campaignId) return;

  Social.tariffs.forEach(tariff => {
    NewCampaign.loadCalculateTariff(tariff, campaignId);
  });

  const {
    min_qty: minQty = null,
    max_qty: maxQty = null,
    qty = null,

    total_events: totalEvents,
    total_budget: totalBudget,
    tools_events: toolsEvents,
    event_cost: eventsCost = null,
  } = await calculateOrderEventsRequest({
    channel_uid: channelType,
    selection_id: selectionId,
    locations: collectCitiesArray(geoPoints),
    campaign_id: campaignId,
    budget,
    ...(channelType === CHANNEL_STUB_SMS ? getSmsToDtoInternetEventsData(state) : {}),
    ...(channelType === CHANNEL_STUB_PUSH ? getPushToDtoInternetEventsData(state) : {}),
    ...(channelType === CHANNEL_STUB_INTERNET ? getViewToDtoInternetEventsData(state) : {}),
  });

  dispatch({
    type: SET_ORDER_EVENTS,
    channelType,
    payload: {
      minQty,
      maxQty,
      qty,
      eventsCost,

      totalBudget,
      toolsEvents,
      totalEvents,
    },
  });
};

/**
 * @param channelType
 * @param payload {boolean}
 */
export const toggleChannel = (channelType, payload) => ({
  type: TOGGLE_CHANNEL,
  channelType,
  payload,
});

export const setOrderId = ({ channelType, orderId: payload }) => ({
  type: SET_ORDER_ID,
  channelType,
  payload,
});

export const resetStorageData = () => ({ type: RESET_STORAGE_DATA });

export const setOrderIsEmpty = (channelType, isEmpty) => ({
  type: SET_ORDER_IS_EMPTY,
  channelType,
  payload: isEmpty,
});

export const setOrderBudget = (channelType, budget) => ({
  type: SET_ORDER_BUDGET,
  channelType,
  payload: budget,
});

const removeFileLocally = (files, id) => files.filter(item => item.id !== id);

export const removeOrderFile = payload => async (dispatch, getState) => {
  try {
    const newFilesList = removeFileLocally(getTargetSmsFilesList(getState()), payload.fileID);

    await deleteOrderFile({
      fileID: payload.fileID,
      orderId: getTargetSmsOrderId(getState()),
    });

    return newFilesList;
  } catch (e) {
    console.error(e);
  }
  return undefined;
};
