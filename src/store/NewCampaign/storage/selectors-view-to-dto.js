import { createSelector } from 'reselect';
import { filterValuable, map } from 'utils/fn';
import { taxonFrontToBack } from 'pages/NewCampaign/helpers';
import { GEO_TYPES } from 'constants/index';
import { collectCitiesArray } from 'store/NewCampaign/storage/actions';
import { getSelectedTaxonsGroups } from '../taxonomy/groups/selectors';
import { getCurrentCampaignId, getTaxonomyData } from './selectors';

export const getActiveTaxonsKeys = createSelector(
  getSelectedTaxonsGroups,
  (groups) => {
    let activeKeys = {};

    groups.forEach((group) => {
      group.items.forEach((item) => {
        activeKeys = { ...activeKeys, [item.value.key]: true };
      });
    });

    // return geo keys as active when we have geo_points key
    if (activeKeys.geo_points) {
      activeKeys.job_geo = true;
      activeKeys.home_geo = true;
      activeKeys.weekend_geo = true;
    }
    return activeKeys;
  },
);

const getTaxonomyDataWithRightGeo = createSelector(
  getTaxonomyData,
  (data) => {
    /* eslint-disable camelcase */
    if (data.geoAction === GEO_TYPES.REGIONS) {
      const {
        geo_points,
        job_geo,
        home_geo,
        weekend_geo,
        ...other
      } = data;

      return { ...other };
    }

    const { any_location, ...other } = data;

    return { ...other };
    /* eslint-enable camelcase */
  },
);

const getActiveTaxonomyData = createSelector(
  getTaxonomyDataWithRightGeo,
  getActiveTaxonsKeys,
  (data, activeKeys) => map(data, (value, key) => (activeKeys[key] ? value : null)),
);

export const getSegmentationData = state => {
  return filterValuable(taxonFrontToBack(getActiveTaxonomyData(state)));
};

/* важная штука */
export const getSelectionRequestData = createSelector(
  getCurrentCampaignId,
  getSegmentationData,
  (campaignId, data) => {
    const locations = data.geo_points ? collectCitiesArray(data.geo_points) : [];
    return ({ campaignId, type: 'segmentation', data, locations });
  },
);
