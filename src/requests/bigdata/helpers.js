import { TAXON_TYPE_SUBGROUP, TAXON_TYPE_BOOLEAN, SUBGROUP_TAXON_PREFIX, TAXON_DEPENDENCY_PARENT_FIELD }
  from 'store/NewCampaign/taxonomy/constants';

export const isBooleanTaxon = item => item.type === TAXON_TYPE_BOOLEAN;
export const getUniqueSubgroupId = item => `${item[TAXON_DEPENDENCY_PARENT_FIELD]}::${item.subgroup}`;

export const unionSubgroupTaxons = (taxonsList, subgroups) => {
  const item = taxonsList[0];
  return {
    id: getUniqueSubgroupId(item),
    taxon_uid: SUBGROUP_TAXON_PREFIX + item.subgroup,
    /** dependent taxons should have their names written down */
    name: item[TAXON_DEPENDENCY_PARENT_FIELD] && (subgroups[item.subgroup] || {}).name || null,
    type: TAXON_TYPE_SUBGROUP,
    description: '',
    subgroup: item.subgroup,
    items: taxonsList.map(({ taxon_uid: key, name }) => ({ value: name, key })),
    [TAXON_DEPENDENCY_PARENT_FIELD]: item[TAXON_DEPENDENCY_PARENT_FIELD],
  };
};
