import { createSelector } from 'reselect';
import { __getCommonData } from '../../selectors';

export const getCampaignStatuses = state => __getCommonData(state).campaignStatuses || [];

export const getCampaignStatusesOptions = createSelector(
  getCampaignStatuses,
  list => list.map(item => ({ label: item.label, value: item.id })),
);
