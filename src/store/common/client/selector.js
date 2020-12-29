import { createSelector } from 'reselect';
import { convertListToObjectBy } from 'utils/fn';
import { getIndustry } from '../userInfo/selector';

export const getClient = state => state.client || {};
export const getClientIndustry = state => getClient(state).industry || [];

export const getClientIndustryOptions = createSelector(
  getClientIndustry,
  items => [
    { value: null, label: 'Не важно' },
    ...items.map(({ id: value, name_ru: label }) => ({
      value,
      label,
    })),
  ],
);

const getIndustryConvertedListToObj = createSelector(getClientIndustryOptions, convertListToObjectBy('value'));

export const getSelectIndustryLabel = createSelector(
  getIndustry,
  getIndustryConvertedListToObj,
  (value, industryMap) => {
    const selectedItem = industryMap[value];
    return selectedItem && selectedItem.label;
  },
);
