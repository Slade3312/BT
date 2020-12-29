import { createSelector } from 'reselect';
import { getNewCampaignData } from '../../selectors';

export const getDictionaries = state => getNewCampaignData(state).dictionaries;
export const getDictionariesIndustries = state => getDictionaries(state).industries;
export const getDictionariesTools = state => getDictionaries(state).tools;
export const getToolsIconsById = createSelector(
  getDictionariesTools,
  (tools) => {
    const result = {};
    tools.forEach((item) => {
      result[item.id] = item.icon;
    });
    return result;
  },
);

export const getDictionariesIndustriesOptions = createSelector(
  getDictionariesIndustries,
  industries =>
    industries.map(item => ({
      label: item.name,
      value: item.id,
    })),
);
