import debouncePromise from 'debounce-promise';
import { requestCampaignDelete, requestMyCampaignsOrders } from 'requests/reports/request-campaign-orders';
import { filterValuable } from 'utils/fn';

import { resetCampaignCreationProcess } from 'store/NewCampaign/steps/actions/update';

import { updateFormState } from '../form';
import { viewToDtoCampaignOrdersFilters } from '../AudienceStatistic/reportData/utils';
import { getCurrentCampaignId } from '../NewCampaign/storage/selectors';
import { setMyCampaignsListData, setMyCampaignsDataLoading, omitCampaignFromList } from './campaignsList/actions';
import {
  getMyCampaignsList,
  getMyCampaignsListLength,
} from './campaignsList/selectors';
import { MY_CAMPAIGNS_FILTER_FORM } from './constants';
import { getMyCampaignsFiltersQuery } from './selectors';

export const updateMyCampaignsFilterForm = updateFormState(MY_CAMPAIGNS_FILTER_FORM);

export const syncMyCampaignsFiltersRequest = (dispatch, getState) => {
  const state = getState();
  const filterParams = getMyCampaignsFiltersQuery(state);
  const preparedParams = viewToDtoCampaignOrdersFilters(filterParams);
  return requestMyCampaignsOrders({ params: filterValuable(preparedParams), offset: 0 });
};

const debouncedMyCampaignsFiltersRequest = debouncePromise(syncMyCampaignsFiltersRequest, 500);

export const syncMyCampaignsFilters = () => formValues => async (dispatch) => {
  dispatch(setMyCampaignsDataLoading(true));
  await dispatch(updateMyCampaignsFilterForm(formValues));

  dispatch(debouncedMyCampaignsFiltersRequest).then((response) => {
    dispatch(setMyCampaignsDataLoading(false));
    dispatch(setMyCampaignsListData({ items: response.results, totalCount: response.count }));
  });
};

export const syncInitialMyCampaigns = () => async (dispatch) => {
  dispatch(setMyCampaignsDataLoading(true));
  try {
    const { results, count } = await dispatch(syncMyCampaignsFiltersRequest);
    dispatch(setMyCampaignsListData({ items: results, totalCount: count }));
  } finally {
    dispatch(setMyCampaignsDataLoading(false));
  }
};

// we have to use this action if next page to loading data exists
export const syncAddMyCampaigns = () => async (dispatch, getState) => {
  const state = getState();
  const filterParams = getMyCampaignsFiltersQuery(state);
  const preparedParams = viewToDtoCampaignOrdersFilters(filterParams);
  const currentOffset = getMyCampaignsListLength(state);
  const currentListData = getMyCampaignsList(state);
  dispatch(setMyCampaignsDataLoading(true));
  try {
    const { results, count } = await requestMyCampaignsOrders({
      params: filterValuable(preparedParams),
      offset: currentOffset,
    });
    const dataWithNextPage = [...currentListData, ...results];
    dispatch(setMyCampaignsListData({ items: dataWithNextPage, totalCount: count }));
  } finally {
    dispatch(setMyCampaignsDataLoading(false));
  }
};

export const syncRemoveCampaign = campaignId => async (dispatch, getState) => {
  const state = getState();
  const editingNewCampaignId = getCurrentCampaignId(state);
  dispatch(setMyCampaignsDataLoading(true));
  try {
    await requestCampaignDelete({ campaignId });
    dispatch(omitCampaignFromList(campaignId));
    if (campaignId === String(editingNewCampaignId)) {
      dispatch(resetCampaignCreationProcess());
    }
  } finally {
    dispatch(setMyCampaignsDataLoading(false));
  }
};
