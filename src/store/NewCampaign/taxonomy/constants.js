export const SET_TAXONS = 'NEW_CAMPAIGN::SET_TAXONS';
export const SET_TAXONS_SUBGROUPS = 'NEW_CAMPAIGN::SET_TAXONS_SUBGROUPS';

export const TAXON_TYPE_CATEGORY = 'category_taxon';
export const TAXON_TYPE_BOOLEAN = 'boolean_taxon';
export const TAXON_TYPE_MAP = 'map_taxon';
export const TAXON_TYPE_ARRAY = 'array_taxon';
export const TAXON_TYPE_GEO = 'geo_taxon';
export const TAXON_TYPE_LOCATION = 'location_taxon';

/** man-made taxon type */
export const TAXON_TYPE_SUBGROUP = 'subgroup_taxon';
export const SUBGROUP_TAXON_PREFIX = 'subgroup::';

export const TaxonTypes = [
  TAXON_TYPE_CATEGORY,
  TAXON_TYPE_BOOLEAN,
  TAXON_TYPE_MAP,
  TAXON_TYPE_ARRAY,
  TAXON_TYPE_GEO,
  TAXON_TYPE_LOCATION,
  TAXON_TYPE_SUBGROUP,
];

export const TAXON_ITEM_NODE = 'taxon';
export const TAXON_GROUP_NODE = 'group';

export const TAXON_GROUP_GEO = 'geo';
export const TaxonNodeTypes = [TAXON_ITEM_NODE, TAXON_GROUP_NODE];

export const BOOLEAN_TAXON_TRUE = 'true';
export const TAXON_DEPENDENCY_PARENT_FIELD = 'parent_id';

export const DESCRIPTION_EXTERNAL_OPERATOR = 'Только для рассылки по билайну';
