import { createSelector } from 'reselect';
import { connectNested, createContextSelector, createReduceSelector } from 'utils/redux';
import { getOpenTaxonSubgroups } from 'store/NewCampaign/controls/selectors';
import { convertListToObjectBy } from 'utils/fn';
import { __getTaxonsData } from '../selectors';
import { TaxonSubgroupContext } from '../context';
import { getTaxonsList } from '../groups/selectors';
import { TAXON_TYPE_SUBGROUP } from '../constants';

export const getTaxonSubgroups = state => __getTaxonsData(state).subgroupsList;

export const connect = (...args) => connectNested([TaxonSubgroupContext], ...args);
export const getData = createContextSelector(TaxonSubgroupContext)(getTaxonSubgroups, convertListToObjectBy('id'));

export const getTitle = createReduceSelector(getData, item => item.name);

export const getSubGroupUid = createReduceSelector(getData, ({ group_uid: groupUid }) => groupUid);

export const getOpenTaxonSubGroupsIds = createSelector(
  getSubGroupUid,
  getOpenTaxonSubgroups,
  (groupUid, openSubgroups) => openSubgroups.includes(groupUid),
);

export const getAllTaxonsBySubgroupsMapIds = createSelector(
  getTaxonsList,
  (taxons) => {
    const result = {};
    const taxonsList = Object.values(taxons);
    taxonsList.forEach((group) => {
      group.forEach((item) => {
        if (item.type === TAXON_TYPE_SUBGROUP) {
          item.items.forEach((subItem) => {
            result[subItem.key] = item.subgroup;
          });
        }
      });
    });
    return result;
  },
);
