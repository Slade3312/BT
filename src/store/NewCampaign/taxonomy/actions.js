import { viewToDtoTaxons } from '../../../pages/NewCampaign/helpers';
import { setOpenTaxonsSubgroups } from '../controls/actions';
import { viewToDtoOpenedTaxonsSubgroups } from '../controls/utils';
import { SET_TAXONS, SET_TAXONS_SUBGROUPS } from './constants';

const setTaxons = payload => ({ type: SET_TAXONS, payload });
const setTaxonsSubgroups = payload => ({ type: SET_TAXONS_SUBGROUPS, payload });

export const setAllTaxonsDtoToViewData = ({ taxonGroups, taxonSubgroups }) => (dispatch) => {
  const preparedTaxons = viewToDtoTaxons(taxonGroups, taxonSubgroups);
  const preparedOpenedTaxonsSubgroups = viewToDtoOpenedTaxonsSubgroups(taxonSubgroups);
  dispatch(setTaxons(preparedTaxons));
  dispatch(setTaxonsSubgroups(taxonSubgroups));
  dispatch(setOpenTaxonsSubgroups(preparedOpenedTaxonsSubgroups));
};
