import { convertListToObjectBy, reduce, sliceBy } from 'utils/fn';
import NewCampaign from 'store/mobx/NewCampaign';
import {
  BOOLEAN_TAXON_TRUE,
  SUBGROUP_TAXON_PREFIX,
  TAXON_DEPENDENCY_PARENT_FIELD, TAXON_GROUP_GEO, TAXON_GROUP_NODE, TAXON_ITEM_NODE, TAXON_TYPE_BOOLEAN, TAXON_TYPE_LOCATION, TAXON_TYPE_SUBGROUP,
} from 'store/NewCampaign/taxonomy/constants';
import { GEO_TYPES } from '../../../constants';
import { TAXON_KEYS } from '../../constants';
import { dtoToViewSelectionDataByKeys } from '../../NewCampaign/campaign/utils';
import { createReduceSelector } from '../../../utils/redux';
import { getIndependentTaxonsList } from '../../NewCampaign/taxonomy/groups/selectors';

const isBooleanTaxon = item => item.type === TAXON_TYPE_BOOLEAN;
const getUniqueSubgroupId = item => `${item[TAXON_DEPENDENCY_PARENT_FIELD]}::${item.subgroup}`;

const unionSubgroupTaxons = (taxonsList, subgroups) => {
  const item = taxonsList[0];
  return {
    id: getUniqueSubgroupId(item),
    taxon_uid: SUBGROUP_TAXON_PREFIX + item.subgroup,
    /** dependent taxons should have their names written down */
    name: item[TAXON_DEPENDENCY_PARENT_FIELD] && (subgroups[item.subgroup] || {}).name || null,
    type: TAXON_TYPE_SUBGROUP,
    description: '',
    subgroup: item.subgroup,
    items: taxonsList.map(({ taxon_uid: key, name, external_operator }) => ({ value: name, key, external_operator })),
    [TAXON_DEPENDENCY_PARENT_FIELD]: item[TAXON_DEPENDENCY_PARENT_FIELD],
  };
};


/**
 * Results in array of arrays of taxons
 * @returns {[[{taxon}]]}
 */
const sliceTaxonsByBooleanSubgroups = list => sliceBy(
  list,
  item => isBooleanTaxon(item) && !item.hasChildren && item.subgroup && getUniqueSubgroupId(item) || NaN,
);


const prepareTaxon = (taxon, allSubgroups) => {
  if (taxon?.items.length && parseInt(taxon.items[0].key, 10)) {
    taxon.items.sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
  }
  return allSubgroups[taxon.subgroup] ? taxon : ({ ...taxon, subgroup: null });
};

/**
 * if boolean taxon has dependent taxons, union must not be applied
 */
const markTaxonDependencies = (taxon, allTaxons) => {
  if (allTaxons.some(({ [TAXON_DEPENDENCY_PARENT_FIELD]: parentId }) => parentId === taxon.id)) {
    return { ...taxon, hasChildren: true };
  }
  return taxon;
};

const prepareTaxons = (taxons, allSubgroups) => taxons.map(taxon =>
  markTaxonDependencies(
    prepareTaxon(taxon, allSubgroups),
    taxons,
  ));

const mergeSubgroupTaxons = (list, subgroups) =>
  sliceTaxonsByBooleanSubgroups(list)
    .reduce((accum, taxons) => [
      ...accum,
      ...taxons.length > 1 ? [unionSubgroupTaxons(taxons, subgroups)] : taxons,
    ], []);


export const viewToDtoTaxons = (groups, allSubgroups) => groups
  .map(group => ({
    ...group,
    taxons: mergeSubgroupTaxons(
      prepareTaxons(
        group.taxons,
        convertListToObjectBy('id')(allSubgroups),
      ),
      convertListToObjectBy('id')(allSubgroups),
    ),
  }));

export const taxonFrontToBack = taxons => reduce(taxons, (result, value, key) => {
  if (key.indexOf(SUBGROUP_TAXON_PREFIX) === 0) {
    return { ...result, ...flattenSubgroupTaxons(value || []) };
  }
  return { ...result, [key]: value };
}, {});

const flattenSubgroupTaxons = values => values.reduce((result, val) => ({ ...result, [val]: BOOLEAN_TAXON_TRUE }), {});

export const collectCitiesArray = geoPoints => geoPoints.map(item => item.city).filter(item => item);

const collectGeoPoints = (selectedTaxons) => {
  // don't collect geo points when geo type - regions checked
  if (selectedTaxons.geoAction === GEO_TYPES.REGIONS) {
    return [];
  }

  const { geo_points: geoPointsList } = selectedTaxons;

  if (geoPointsList) {
    return geoPointsList.map(item => ({
      value: {
        key: 'geo_points',
        value: [item.lat, item.lng],
      },
      label: item.address,
    }));
  }

  return [];
};

// Адское легаси, просто ужасно
export const isBooleanType = type => type === TAXON_TYPE_BOOLEAN;

const isLocationTaxon = item => item.type === TAXON_TYPE_LOCATION;

const getTaxonItemByValue = (taxonIems, value) => taxonIems.find(item => value === item.key);

const getTaxonLabel = (name, value) => (name ? `${name}: ${value}` : value);

const getLocationTaxonLabel = taxonItem => (taxonItem.alias_value || taxonItem.value);

/**
 * TODO: переписать полностью, начать с того, что хэлпер просто убрать хелпер,
 *   слишком сложно завернуты данные, селекторы используются тоже сложно, данные тянутся сложно
 */
const getSubStepSelectedTaxons = (taxonsGroups, selectedTaxonsValues) =>
  Object.keys(selectedTaxonsValues).reduce((result, selectedTaxonKey) => {
    const selectedTaxon = taxonsGroups.find(taxon => taxon.taxon_uid === selectedTaxonKey);
    if (!selectedTaxon) {
      return result;
    }

    const selectedTaxonValue = selectedTaxonsValues[selectedTaxonKey];
    if (!selectedTaxonValue) {
      return result;
    }

    // remove any_location if checked geo type - points
    if (selectedTaxonsValues.geoAction === GEO_TYPES.POINTS && selectedTaxonKey === TAXON_KEYS.ANY_LOCATION) {
      return result;
    }

    const parentTaxon = taxonsGroups.find(tGroup => tGroup.id === selectedTaxon.parent_id);
    // if parent boolean taxon is enabled then we add child taxons
    const hasEnabledParentBooleanTaxon =
      parentTaxon && selectedTaxonsValues[parentTaxon.taxon_uid] === BOOLEAN_TAXON_TRUE;

    if (!parentTaxon || hasEnabledParentBooleanTaxon) {
      if (isBooleanType(selectedTaxon.type)) {
        const selectedTaxonItem = getTaxonItemByValue(selectedTaxon.items, selectedTaxonValue);

        result.push({
          value: {
            key: selectedTaxonKey,
            value: selectedTaxonItem.key,
            external_operator: selectedTaxonItem.external_operator,
          },
          label: getTaxonLabel(selectedTaxon.name, selectedTaxonItem.value),
        });
      } else {
        const selectedTaxonItems = selectedTaxonValue.map
          ? selectedTaxonValue.map(value => getTaxonItemByValue(selectedTaxon.items, value))
          : [];

        selectedTaxonItems
          .filter(item => item)
          .forEach(taxonItem =>
            result.push({
              value: {
                key: selectedTaxonKey,
                // TODO Check if we can remove this and remove
                value: taxonItem.key,
                external_operator: taxonItem.external_operator,
              },
              label: isLocationTaxon(selectedTaxon)
                ? getLocationTaxonLabel(taxonItem)
                : getTaxonLabel(selectedTaxon.name, taxonItem.value),
            }));
      }
    }

    return result;
  }, []);

export const getSelectedTaxonsGroupsList = (taxonsList, selectedTaxons) => taxonsList.reduce((result, subStepTaxon) => {
  const subStepTaxons = subStepTaxon.taxons;
  if (!subStepTaxons || !subStepTaxons.length) {
    return result;
  }

  let subStepSelectedTaxons = getSubStepSelectedTaxons(subStepTaxons, selectedTaxons);

  if (subStepTaxon.group_uid === TAXON_GROUP_GEO) {
    subStepSelectedTaxons = subStepSelectedTaxons.concat(collectGeoPoints(selectedTaxons));
  }

  result.push({
    title: subStepTaxon.name,
    slug: subStepTaxon.group_uid,
    items: subStepSelectedTaxons,
  });

  return result;
}, []);

export const getTaxonomyDataWithRightGeo = (data) => {
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
};

const dtoToViewMapTaxonsBySubgroups = (dtoTaxonsData, subgroupsMap) => {
  const resultData = {};
  Object.keys(dtoTaxonsData).forEach((key) => {
    const value = dtoTaxonsData[key];
    if (subgroupsMap[key]) {
      const subgroupKey = `${SUBGROUP_TAXON_PREFIX}${subgroupsMap[key]}`;

      if (!resultData[subgroupKey]) {
        resultData[subgroupKey] = [];
      }
      resultData[subgroupKey].push(key);
    } else {
      resultData[key] = value;
    }
  });
  return resultData;
};

/**
 * subgroup taxons has especially mapping, subgroupMap must contains
 * all plain mapping between any taxon key and subgroup id
 * also we have to enable all subgroup taxons toggles
 */
export const dtoToViewSelectionDraft = ({ data, ...otherFields }, subgroupMap) => {
  const mappedTaxonsData = dtoToViewMapTaxonsBySubgroups(data, subgroupMap);

  return {
    ...otherFields,
    data: mappedTaxonsData ? dtoToViewSelectionDataByKeys(mappedTaxonsData) : {},
  };
};

export const getActiveTaxonsKeys = (groups) => {
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
};

/**
 * Groups Taxons by `subgroup` if it's available,
 * otherwise just return single taxon nodes, thus each element has one of two data formats
 * {
 *   type: TAXON_GROUP_NODE,
 *   groupId: '123',
 *   taxonIds: [1, 2, 3],
 * }
 * or
 * {
 *   type: TAXON_ITEM_NODE,
 *   taxonId: 3,
 * }
 */
export const getGroupedParentsTaxonNodes = (list) => {
  const nodes = [];
  while (list.length) {
    const taxon = list[0];
    const groupId = taxon.subgroup;

    if (groupId) {
      const isSameGroup = item => item.subgroup === groupId;
      const subgroupTaxonsIds = list.filter(isSameGroup).map(item => item.id);

      list = list.filter(item => !isSameGroup(item));
      nodes.push({ ...taxon, subgroupTaxonsIds, groupId, groupType: TAXON_GROUP_NODE });
    } else {
      list = list.slice(1);
      nodes.push({ ...taxon, groupType: TAXON_ITEM_NODE });
    }
  }
  return nodes;
};

export const getLocationLabelByProps = (itemsMap, { value, parent, alias_value }) => {
  if (parent && itemsMap[parent]) {
    return `${itemsMap[parent].value}, ${value}`;
  }
  if (alias_value) {
    return alias_value;
  }
  return value;
};
