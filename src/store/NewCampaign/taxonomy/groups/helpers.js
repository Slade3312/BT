import { GEO_TYPES } from 'constants/index';
import { TAXON_KEYS } from 'store/constants';
import { BOOLEAN_TAXON_TRUE, TAXON_TYPE_BOOLEAN, TAXON_TYPE_LOCATION, TAXON_GROUP_GEO } from '../../taxonomy/constants';

export const isBooleanTaxon = type => type === TAXON_TYPE_BOOLEAN;

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
      if (isBooleanTaxon(selectedTaxon.type)) {
        const selectedTaxonItem = getTaxonItemByValue(selectedTaxon.items, selectedTaxonValue);

        result.push({
          value: {
            key: selectedTaxonKey,
            value: selectedTaxonItem.key,
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
              },
              label: isLocationTaxon(selectedTaxon)
                ? getLocationTaxonLabel(taxonItem)
                : getTaxonLabel(selectedTaxon.name, taxonItem.value),
            }));
      }
    }

    return result;
  }, []);

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
