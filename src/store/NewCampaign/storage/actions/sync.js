import debounce from 'debounce';
import {
  RESET_GEO_TAXON_VALUE,
  RESET_TAXON_VALUE,
  SYNC_CAMPAIGN_DATA,
  SYNC_ORDER_DATA,
  SYNC_TAXONS_DATA,
} from '../../constants';
import { ORDER_BUDGET_FIELD } from '../../channels/constants';
import {
  calculateAllOrderEventsCount,
  saveModifiedSegmentationData,
  saveModifiedSegmentationDataDebounced,
} from '../../steps/actions/update';
import { getCampaignData } from '../selectors';
import { checkValidToCalculateInternet, getMinBudget } from '../../channels/selectors';
import { setSelectionIsLoading } from '../../controls/actions';
import { modifyGeoPoints } from '../utils';
import { CHANNEL_STUB_INTERNET } from '../../../../constants';
import { getCommonCampaignChannelTypesById } from '../../../common/campaign/selectors';
import { setOrderEventsCount } from './index';

export const syncCampaignData = payload => async (dispatch, getState) => {
  const state = getState();

  /** must be called before dispatching SYNC_CAMPAIGN_DATA */
  const { id, strategy: prevStrategy } = getCampaignData(state);
  const { strategy: nextStrategy } = payload;

  dispatch({
    type: SYNC_CAMPAIGN_DATA,
    payload,
  });

  /** once campaign is created, each strategy change results in instant save action */
  if (prevStrategy !== nextStrategy && id) {
    dispatch(saveModifiedSegmentationDataDebounced());
  }
};

const modifyPayloadWithGeoTaxons = payload => payload.geo_points ? modifyGeoPoints(payload) : payload;

export const syncTaxonomyData = payload => (dispatch) => {
  dispatch({
    type: SYNC_TAXONS_DATA,
    payload: modifyPayloadWithGeoTaxons(payload),
  });
  dispatch(setSelectionIsLoading(true));
  dispatch(saveModifiedSegmentationDataDebounced());
};

// using passing params upright because we shouldn't  execute 'promise then' after request
const syncResetTaxonDebounced = debounce((dispatch) => {
  dispatch(saveModifiedSegmentationData()).then(() => {
    dispatch(calculateAllOrderEventsCount());
  });
}, 200);

export const resetTaxon = payload => async (dispatch, getState) => {
  dispatch({
    type: payload.key === 'geo_points' ? RESET_GEO_TAXON_VALUE : RESET_TAXON_VALUE,
    payload,
  });

  syncResetTaxonDebounced(dispatch, getState);
};

const debouncedOrderEvents = debounce((d, dispatch) => dispatch(setOrderEventsCount(d)), 500);

export const syncOrderData = (channelType, payload) => (dispatch) => {
  dispatch({
    type: SYNC_ORDER_DATA,
    channelType,
    payload,
  });
};

const syncOrderEvents = (channelType, payload) => (dispatch, getState) => {
  const state = getState();
  if (channelType === CHANNEL_STUB_INTERNET) {
    const channelTypesData = getCommonCampaignChannelTypesById(state);
    const channelData = channelTypesData[channelType];

    if (checkValidToCalculateInternet(payload, channelData)) {
      debouncedOrderEvents({ channelType }, dispatch);
    }
  } else {
    /** only call calculator when budget is set */
    const budget = payload[ORDER_BUDGET_FIELD];
    const minBudget = getMinBudget(state)[channelType];
    const actualBudget = budget || minBudget;
    if (actualBudget >= minBudget) {
      debouncedOrderEvents({ channelType, budget: actualBudget }, dispatch);
    }
  }
};

export const syncOrderDataAndEvents = (channelType, payload) => (dispatch) => {
  dispatch(syncOrderData(channelType, payload));
  dispatch(syncOrderEvents(channelType, payload));
};
