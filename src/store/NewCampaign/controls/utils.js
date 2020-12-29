export const viewToDtoOpenedTaxonsSubgroups = subgroupList =>
  subgroupList.filter(({ preopen }) => preopen).map(({ group_uid: groupUid }) => groupUid);
