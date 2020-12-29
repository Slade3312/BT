import { navigate } from '@reach/router';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import {
  initOrdersEventsCountFromDraft,
  resetCampaignCreationProcess,
  syncSelection,
} from 'store/NewCampaign/steps/actions/update';
import { setCampaignId, toggleChannel, collectCitiesArray } from 'store/NewCampaign/storage/actions';
import {
  syncOrderData,
} from 'store/NewCampaign/storage/actions/sync';
import { setSelectionData, setSelectionIsLoading } from 'store/NewCampaign/controls/actions';
import { STRATEGY_TYPE_SEGMENTS } from 'store/NewCampaign/controls/constants';
import { throwNonBlockingError } from 'utils/errors';
import {
  getAllTaxonsBySubgroupsMapIds,
} from 'store/NewCampaign/taxonomy/subGroups/selectors';
import { convertListToObjectBy } from 'utils/fn';
import WebsAndPhonesTaxons from 'store/mobx/WebsAndPhonesTaxons';

import {
  STEP_SLUG_CHANNELS,
  STEP_SLUG_TAXONS,
  SYNC_CAMPAIGN_DATA,
  SYNC_TAXONS_DATA,
} from '../constants';

import { NEW_CAMPAIGN_CHANNELS, TAXON_KEYS } from '../../constants';
import { getGeoPoints } from '../storage/selectors';
import { filterNewCampaignChannels } from '../../utils';
import { SET_CAMPAIGN_LOADER, SET_PROMOCODE_DATA, ERASE_PROMOCODES } from './constants';
import { dtoToViewDraftData, dtoToViewAnyLocation, dtoToViewSelectionDraft } from './utils';

const setCampaignData = payload => ({
  type: SYNC_CAMPAIGN_DATA,
  payload,
});

const setChannelsDraftData = campaignOrders => (dispatch, getState) => {
  const state = getState();
  const campaignOrdersData = convertListToObjectBy('channel_uid')(campaignOrders);

  NEW_CAMPAIGN_CHANNELS.forEach((channelType) => {
    const orderData = campaignOrdersData[channelType] || {};
    dispatch(syncOrderData(channelType, dtoToViewDraftData(orderData, channelType, state)));
  });
};

export const setRightStepFromDraft = (campaignData) => {
  const hasCurrentOrders = campaignData.orders.length > 0;
  const hasCampaignNoEmptyOrders = campaignData.orders.filter(order => !order.is_empty).length !== 0;

  if (hasCurrentOrders && hasCampaignNoEmptyOrders) {
    return navigate(`${NEW_CAMPAIGN_URL}${campaignData.id}/${STEP_SLUG_CHANNELS}`);
  } else if (
    (campaignData.selection && Object.keys(campaignData.selection.data).length) || WebsAndPhonesTaxons.hasSegmentsStrategy
  ) {
    return navigate(`${NEW_CAMPAIGN_URL}${campaignData.id}/${STEP_SLUG_TAXONS}`);
  }
  return navigate(`${NEW_CAMPAIGN_URL}${campaignData.id}/`);
};

export const initSelectionData = (selectionData, campaignId) => async (dispatch, getState) => {
  const state = getState();
  const subgroupTaxonsMap = getAllTaxonsBySubgroupsMapIds(state);

  /* Группировка таксонов по типу для отображения в интерфейсе */
  const preparedSelection = dtoToViewSelectionDraft(selectionData, subgroupTaxonsMap);

  // set taxons and geo taxons
  dispatch(setSelectionData({ ...preparedSelection, selection_id: selectionData.id }));

  dispatch({
    type: SYNC_TAXONS_DATA,
    payload: preparedSelection.data,
  });

  // recalculate selection based on initial draft data

  dispatch(setSelectionIsLoading(true));

  const geoPoints = getGeoPoints(getState());

  const selectionToServer = {
    ...selectionData.data,
    [TAXON_KEYS.ANY_LOCATION]: dtoToViewAnyLocation(selectionData.data[TAXON_KEYS.ANY_LOCATION] || {}),
    [TAXON_KEYS.GEO_POINTS]: selectionData.data[TAXON_KEYS.JOB_GEO] || selectionData.data[TAXON_KEYS.HOME_GEO] || selectionData.data[TAXON_KEYS.WEEKEND_GEO],
  };

  if (selectionToServer[TAXON_KEYS.ANY_LOCATION].length === 0) {
    delete selectionToServer[TAXON_KEYS.ANY_LOCATION];
  }

  await syncSelection(
    {
      campaignId,
      type: STRATEGY_TYPE_SEGMENTS,
      locations: collectCitiesArray(geoPoints),
      data: selectionToServer,
    },
    dispatch,
    getState(),
  );
};

export const initializeCampaignFromDraft = campaignData => async (dispatch) => {
  await dispatch(resetCampaignCreationProcess());

  const currentOrders = filterNewCampaignChannels(campaignData.orders || []);

  dispatch(setCampaignId(campaignData.id));
  dispatch(setCampaignData({ name: campaignData.name }));

  // init orders campaign data
  if (currentOrders.length > 0) {
    dispatch(setChannelsDraftData(currentOrders));
  } else {
    // для старых кампаний в черновиках, либо при ошибках сервера
    NEW_CAMPAIGN_CHANNELS.forEach((channel) => {
      dispatch(toggleChannel(channel, true));
    });
  }

  // init existing promocode (support only one promocode)
  if (campaignData?.promo_codes?.length > 0) {
    const curData = campaignData?.promo_codes[0];
    dispatch(setPromocodeByExistingChannels({ ...curData, code: curData.promo_code, isValid: true }));
  }

  // init selection campaign data
  const selectionData = campaignData.selection;

  if (selectionData && selectionData.id) {
    await dispatch(initSelectionData(selectionData, campaignData.id));

    dispatch(initOrdersEventsCountFromDraft());
  } else {
    throwNonBlockingError(`Selection for this draft doesn't exist,
      calculate will not execute. Campaign id: ${campaignData.id}`);
  }
};


export const setCampaignLoader = (namespace, flag) => ({
  type: SET_CAMPAIGN_LOADER,
  payload: { namespace, flag },
});

const setPromocode = (data, promocodeType) => {
  return {
    type: SET_PROMOCODE_DATA,
    payload: {
      data,
      promocodeType,
    },
  };
};

export const erasePromocodes = () => ({ type: ERASE_PROMOCODES });

const setCampaignPromocodeData = (data) => dispatch => {
  data?.channels?.forEach(({ channel_type }) => {
    dispatch(setPromocode(data, channel_type));
  });
  // according business requirements, we always set last applied promocode to total block
  dispatch(setPromocode(data, 'all'));
};

export const setPromocodeByExistingChannels = (data) => (dispatch) => {
  dispatch(erasePromocodes());

  if (data.isValid) {
    dispatch(setCampaignPromocodeData(data));
  }
};

export const setPromocodeOverdue = (data) => dispatch => {
  if (data.isValid && !data.isOverdue) {
    dispatch(setCampaignPromocodeData({ ...data, isOverdue: true, isValid: false, code: '' }));
  }
};
