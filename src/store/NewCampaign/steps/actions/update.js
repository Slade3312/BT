import debouncePromise from 'debounce-promise';
import { set } from 'mobx';
import { setSelectionRequest, requestPushRestrictedAudience } from 'requests/campaigns';
import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_VOICE } from 'constants/index';
import { filterNewCampaignChannels } from 'store/utils';
import { setCampaignChannelTypes } from 'store/common/campaign/actions';
import { SET_CHANNEL_TYPES } from 'store/NewCampaign/channels/constants';
import { convertLegacyChannel } from 'store/NewCampaign/channels/utils';
import { getNewCampaignOrdersData } from 'store/NewCampaign/storage/selectors';
import { getSelectionRequestData } from 'store/NewCampaign/storage/selectors-view-to-dto';
import { pushNotification } from 'store/notifications/actions';
import { SET_PUSH_ANDROID_NOTIFICATION_DATA } from 'store/notifications/constants';
import { getPushSelectionIsActive } from 'store/NewCampaign/controls/selectors';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { getChannelsListMap } from 'store/NewCampaign/selectors';
import Social from 'store/mobx/Social';
import {
  getMinBudget,
  pickActiveBudgetByChannelAndOrder,
  checkValidToCalculateInternet,
} from 'store/NewCampaign/channels/selectors';
import {
  resetControlsData,
  toggleCampaignSuccess,
  setSelectionData,
  setSelectionIsLoading,
} from 'store/NewCampaign/controls/actions';
import {
  resetStorageData,
  setOrderEventsCount,
  setPushSelection,
} from 'store/NewCampaign/storage/actions';
import NewCampaign from 'store/mobx/NewCampaign';

import { getMinimalBugetToChannels } from '../helpers';
import { RESET_NEW_CAMPAIGN_DATA } from '../../campaign/constants';

/**
 * Returns promise with error data consistent with FinalForm, otherwise `null` if there are no errors
*/
export const calculateAllOrderEventsCount = () => (dispatch, getState) => {
  const state = getState();
  // TODO add Social to ordersMap
  const ordersMap = getNewCampaignOrdersData(state);
  const channelsMap = getCommonCampaignChannelTypesById(state);

  Object.keys(ordersMap).forEach((channelId) => {
    const curOrder = ordersMap[channelId];
    const curChannel = channelsMap[channelId];

    const minOrderBudget = getMinBudget(state)[channelId];

    if (channelId === CHANNEL_STUB_VOICE) {
      const actualOrderBudget = pickActiveBudgetByChannelAndOrder(curOrder, curChannel);

      dispatch(setOrderEventsCount({ channelType: channelId, budget: actualOrderBudget > minOrderBudget ? actualOrderBudget : minOrderBudget }));
    } else if (channelId !== CHANNEL_STUB_INTERNET) {
      const actualOrderBudget = pickActiveBudgetByChannelAndOrder(curOrder, curChannel);

      if (actualOrderBudget >= minOrderBudget) {
        dispatch(setOrderEventsCount({ channelType: channelId, budget: actualOrderBudget }));
      }
    } else if (checkValidToCalculateInternet(curOrder, curChannel)) {
      dispatch(setOrderEventsCount({ channelType: channelId }));
    }
  });
};

export const initOrdersEventsCountFromDraft = () => (dispatch, getState) => {
  const state = getState();
  // TODO add Social to ordersMap
  const ordersMap = getNewCampaignOrdersData(state);
  const channelsMap = getChannelsListMap(state);
  Object.keys(ordersMap).forEach((channelId) => {
    const curOrder = ordersMap[channelId];
    const curChannel = channelsMap[channelId];

    const minOrderBudget = getMinBudget(state)[channelId];

    if (channelId !== CHANNEL_STUB_INTERNET) {
      const actualOrderBudget = pickActiveBudgetByChannelAndOrder(curOrder, curChannel);

      if (actualOrderBudget >= minOrderBudget) {
        dispatch(setOrderEventsCount({ channelType: channelId, budget: actualOrderBudget }));
      } else {
        dispatch(setOrderEventsCount({ channelType: channelId, budget: minOrderBudget }));
      }
    } else if (checkValidToCalculateInternet(curOrder, curChannel)) {
      dispatch(setOrderEventsCount({ channelType: channelId }));
    }
  });
};

const setChannelTypes = payload => ({ type: SET_CHANNEL_TYPES, payload });

export const syncSelection = async (d, dispatch, state) => {
  dispatch(setSelectionIsLoading(true));

  const data = await setSelectionRequest(d)
    .then((res) => {
      const { channelTypes } = state.common.campaign;
      const channelsWithBudget = getMinimalBugetToChannels(channelTypes, res);
      const newCampaignChannels = filterNewCampaignChannels(channelsWithBudget);
      const preparedData = newCampaignChannels.map(convertLegacyChannel);
      dispatch(setChannelTypes(preparedData));
      dispatch(setCampaignChannelTypes(channelsWithBudget));
      return res;
    })
    .catch((err) => {
      throw err;
    });

  dispatch(setSelectionData(data));

  // MobX
  // В NewCampaign.currentCampaign.selection объединяются данные из черновика заказа order.selection
  // и из запроса на client/campaigns/:campaignId/selection.
  set(
    NewCampaign.currentCampaign.selection,
    { ...NewCampaign.currentCampaign.selection, ...data },
  );

  dispatch(setSelectionIsLoading(false));

  const isPushSelectionActive = getPushSelectionIsActive(state);

  if (isPushSelectionActive) {
    dispatch(setSelectionIsLoading(true));

    try {
      const resp = await requestPushRestrictedAudience({ campaignId: d.campaignId });

      if (data.audience) {
        dispatch(pushNotification(SET_PUSH_ANDROID_NOTIFICATION_DATA, resp));
        dispatch(setPushSelection({
          audience: resp.audience,
          isActive: true,
        }));
      }
    } finally {
      dispatch(setSelectionIsLoading(false));
    }
  }
};

const debouncedSelectionRequest = debouncePromise(syncSelection, 400);

export const saveModifiedSegmentationDataDebounced = () => async (dispatch, getState) =>
  debouncedSelectionRequest(getSelectionRequestData(getState()), dispatch, getState());

export const saveModifiedSegmentationData = () => async (dispatch, getState) =>
  syncSelection(getSelectionRequestData(getState()), dispatch, getState());

const resetNewCampaignData = () => ({ type: RESET_NEW_CAMPAIGN_DATA });

export const resetCampaignCreationProcess = () => async (dispatch) => {
  Social.resetInternetTargetData();
  dispatch(toggleCampaignSuccess(false));
  dispatch(resetStorageData());
  dispatch(resetControlsData());
  dispatch(resetNewCampaignData());
};

export const resetCampaign = () => async (dispatch) => {
  Social.resetInternetTargetData();
  dispatch(resetStorageData());
  dispatch(resetControlsData());
  dispatch(resetNewCampaignData());
};
