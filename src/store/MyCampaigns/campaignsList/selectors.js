import { createSelector } from 'reselect';
import { getNewCampaignData } from 'store/selectors';

import { MY_CAMPAIGNS_LIST_PAGE_SIZE } from '../constants';

const _getMyCampaignsData = createSelector(
  getNewCampaignData,
  body => body.myCampaigns,
);

export const getIsListLoading = state => _getMyCampaignsData(state).isListLoading;

export const getMyCampaignsList = createSelector(
  _getMyCampaignsData,
  campaignsData => campaignsData.items,
);

const getMyCampaignsListTotalCount = createSelector(
  _getMyCampaignsData,
  data => data.totalCount,
);

export const getMyCampaignsListLength = createSelector(
  getMyCampaignsList,
  items => items.length,
);

export const getMyCampaignsListNextPageCount = createSelector(
  getMyCampaignsListTotalCount,
  getMyCampaignsListLength,
  (totalLength, loadedLength) => totalLength - loadedLength,
);

export const getAllowCountPerNextPage = createSelector(
  getMyCampaignsListNextPageCount,
  count => (count > MY_CAMPAIGNS_LIST_PAGE_SIZE ? MY_CAMPAIGNS_LIST_PAGE_SIZE : count),
);

export const getHasMyCampaignsListNextPageData = createSelector(
  getMyCampaignsListNextPageCount,
  count => count > 0,
);
