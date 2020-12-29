import { axiosAuthorizedRequest } from 'requests/helpers';
import { TAXON_GROUP_API_URL, TAXON_SUBGROUP_API_URL } from './constants';

export const requestTaxonGroups = () => axiosAuthorizedRequest({ url: TAXON_GROUP_API_URL });

export const requestTaxonSubGroups = () => axiosAuthorizedRequest({ url: TAXON_SUBGROUP_API_URL });

export const requestAllTaxonsData = () =>
  Promise.all([requestTaxonGroups(), requestTaxonSubGroups()]).then(([taxonGroups, taxonSubgroups]) => ({
    taxonGroups,
    taxonSubgroups,
  }));
