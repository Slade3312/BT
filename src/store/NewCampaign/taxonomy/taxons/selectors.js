import { createSelector } from 'reselect';
import { convertListToObjectBy } from 'utils/fn';
import { connectNested, createContextSelector, createReduceSelector } from 'utils/redux';
import { getTaxonValuesByName } from '../../storage/selectors';
import { getTaxonsList, getIndependentTaxonsList, getDependentTaxonsList } from '../groups/selectors';
import { TaxonContext, TaxonGroupsContext } from '../context';
import {
  BOOLEAN_TAXON_TRUE,
  TAXON_DEPENDENCY_PARENT_FIELD,
  TAXON_GROUP_NODE,
  TAXON_ITEM_NODE,
  TAXON_TYPE_BOOLEAN,
  TAXON_TYPE_LOCATION,
} from '../constants';

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
export const getIndependentGroupedTaxonNodes = createReduceSelector(
  getIndependentTaxonsList,
  (list) => {
    const nodes = [];
    while (list.length) {
      const taxon = list[0];
      const groupId = taxon.subgroup;

      if (groupId) {
        const isSameGroup = item => item.subgroup === groupId;
        const taxonIds = list.filter(isSameGroup).map(item => item.id);
        list = list.filter(item => !isSameGroup(item));
        nodes.push({ type: TAXON_GROUP_NODE, groupId, taxonIds });
      } else {
        list = list.slice(1);
        nodes.push({ type: TAXON_ITEM_NODE, taxonId: taxon.id });
      }
    }
    return nodes;
  },
);

export const connect = (...args) => connectNested([TaxonGroupsContext, TaxonContext], ...args);

const getData = createContextSelector(TaxonContext)(getTaxonsList, convertListToObjectBy('id'));

const getId = createReduceSelector(getData, item => item.id);

export const getType = createReduceSelector(getData, item => item.type);

export const getName = createReduceSelector(getData, item => item.taxon_uid);

export const getTitle = createReduceSelector(getData, item => item.name);

export const getDescription = createReduceSelector(getData, item => item.description);

export const getItemsList = createReduceSelector(getData, taxon => taxon.items || []);

export const getItemsById = createReduceSelector(getItemsList, convertListToObjectBy('key'));

const getLocationLabelByProps = (itemsMap, { value, parent, alias_value }) => {
  if (parent && itemsMap[parent]) {
    return `${itemsMap[parent].value}, ${value}`;
  }
  if (alias_value) {
    return alias_value;
  }
  return value;
};

export const getItemsAsOptions = createReduceSelector(
  getItemsList,
  getItemsById,
  getType,
  (items, itemsById, taxonType) => {
    if (taxonType === TAXON_TYPE_LOCATION) {
      return items.map(({ key, value, parent, alias_value }) => ({
        value: key,
        label: getLocationLabelByProps(itemsById, { value, parent, alias_value }),
      }));
    }
    return items.map(({ key, value }) => ({ value: key, label: value }));
  },
);

export const getIsChecked = createReduceSelector(
  getTaxonValuesByName,
  getName,
  (valueDict, name) => valueDict[name] === BOOLEAN_TAXON_TRUE,
);

export const getChildTaxonIds = createReduceSelector(
  getId,
  getDependentTaxonsList,
  (parentId, taxons) => taxons
    .filter(item => item[TAXON_DEPENDENCY_PARENT_FIELD] === parentId)
    .map(item => item.id),
);

export const getChildrenAvailability = createReduceSelector(getChildTaxonIds, list => !!list.length);

export const getIsToggleTaxonView = createSelector(
  getItemsList,
  getType,
  getChildrenAvailability,
  (items, type, hasChildren) => hasChildren || (type === TAXON_TYPE_BOOLEAN && items.length === 1),
);
