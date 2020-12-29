import { getUniqueSubgroupId, isBooleanTaxon, unionSubgroupTaxons } from 'requests/bigdata/helpers';
import { convertListToObjectBy, reduce, sliceBy } from 'utils/fn';
import {
  BOOLEAN_TAXON_TRUE,
  SUBGROUP_TAXON_PREFIX,
  TAXON_DEPENDENCY_PARENT_FIELD,
} from '../../store/NewCampaign/taxonomy/constants';


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

/**
 * Results in array of arrays of taxons
 * @returns {[[{taxon}]]}
 */
const sliceTaxonsByBooleanSubgroups = list => sliceBy(
  list,
  item => isBooleanTaxon(item) && !item.hasChildren && item.subgroup && getUniqueSubgroupId(item) || NaN,
);

const convertListToObjectById = convertListToObjectBy('id');

export const viewToDtoTaxons = (groups, allSubgroups) => groups
  .map(group => ({
    ...group,
    taxons: mergeSubgroupTaxons(
      prepareTaxons(
        group.taxons,
        convertListToObjectById(allSubgroups),
      ),
      convertListToObjectById(allSubgroups),
    ),
  }));

/**
 * Unwrap subgroup taxons, they look like { 'subgroup:_' [name1, name2] }
 * and should be converted back to boolean taxons { [name1]: 'true', [name2]: 'true' }
 */
export const taxonFrontToBack = taxons => reduce(taxons, (result, value, key) => {
  if (key.indexOf(SUBGROUP_TAXON_PREFIX) === 0) {
    return { ...result, ...flattenSubgroupTaxons(value || []) };
  }
  return { ...result, [key]: value };
}, {});

const flattenSubgroupTaxons = values => values.reduce((result, val) => ({ ...result, [val]: BOOLEAN_TAXON_TRUE }), {});
