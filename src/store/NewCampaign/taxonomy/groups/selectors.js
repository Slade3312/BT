import { createSelector } from 'reselect';

import { createContextSelector, createReduceSelector, connectNested } from 'utils/redux';
import { convertListToObjectBy } from 'utils/fn';

import { getTaxonomyData } from '../../storage/selectors';
import { __getTaxonsData } from '../selectors';
import { TaxonGroupsContext } from '../context';
import { TAXON_GROUP_GEO, TAXON_DEPENDENCY_PARENT_FIELD } from '../constants';
import { getSelectedTaxonsGroupsList } from './helpers';


export const getGroupsList = state => __getTaxonsData(state).list;

export const getSubStepsFromTaxonGroups = createSelector(
  getGroupsList,
  groups => groups.map(({ group_uid: groupUID, name }) => ({
    slug: groupUID,
    title: name,
    isSubStep: true,
  })),
);

export const connect = (...args) => connectNested([TaxonGroupsContext], ...args);

export const getData = createContextSelector(TaxonGroupsContext)(
  getGroupsList,
  convertListToObjectBy('group_uid'),
);

export const getTitle = createReduceSelector(
  getData,
  group => group.name,
);

export const getTaxonsList = createReduceSelector(
  getData,
  group => (group.taxons || []),
);

export const getIndependentTaxonsList = createReduceSelector(
  getTaxonsList,
  list => list.filter(item => !item[TAXON_DEPENDENCY_PARENT_FIELD]),
);

export const getDependentTaxonsList = createReduceSelector(
  getTaxonsList,
  list => list.filter(item => item[TAXON_DEPENDENCY_PARENT_FIELD]),
);

export const getSelectedTaxonsGroups = createSelector(
  [getGroupsList, getTaxonomyData],
  (taxonsList, taxonomyData) => getSelectedTaxonsGroupsList(taxonsList, taxonomyData),
);

export const getSegmentationChannelsTaxonsGroups = createSelector(
  getSelectedTaxonsGroups,
  groupsList => groupsList.filter(group => group.slug !== TAXON_GROUP_GEO),
);

export const getSegmentationViewerTaxonsGroups = createSelector(
  getSelectedTaxonsGroups,
  groupsList => groupsList.filter(group => !!group.items.length),
);
