import { getPreparedFilterStatusParams } from 'store/shared/campaign-and-orders/utils';

export const viewToDtoCampaignOrdersFilters = ({ status, ...otherParams }) => ({
  ...otherParams,
  ...(status ? getPreparedFilterStatusParams(status) : {}),
});
