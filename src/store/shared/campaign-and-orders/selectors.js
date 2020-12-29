import {
  getOrderStatusesOptions,
} from 'store/common/ordersStatuses/selectors';
import { CAMPAIGN_STATUSES } from '../../../constants';
import { FILTER_STATUS_PREFIXES } from './constants';

const makeCampaignStatusValue = id => `${FILTER_STATUS_PREFIXES.CAMPAIGN}:${id}`;
const makeOrderStatusValue = id => `${FILTER_STATUS_PREFIXES.ORDER}:${id}`;

const prepareCampaignStatuses = optionsList =>
  optionsList.map(elem => ({ value: makeCampaignStatusValue(elem.value), label: elem.label }));
const prepareOrderStatuses = optionsList =>
  optionsList.map(elem => ({ value: makeOrderStatusValue(elem.value), label: elem.label, id: elem.value }));

const DEFAULT_STATUS_OPTION = { value: '', label: 'Не выбрано' };

export const getCampaignAndOrderStatusesOptions = (campaignStatuses = [], orderStatuses) => {
  const orderStatusesOptions = getOrderStatusesOptions(orderStatuses);
  const campaignDraftStatusObj = campaignStatuses.find(status => status.value === CAMPAIGN_STATUSES.DRAFT);
  return [
    DEFAULT_STATUS_OPTION,
    ...prepareCampaignStatuses(campaignDraftStatusObj ? [campaignDraftStatusObj] : []),
    ...prepareOrderStatuses(orderStatusesOptions),
  ];
};

