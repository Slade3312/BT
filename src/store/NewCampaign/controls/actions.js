import {
  RESET_CONTROLS_DATA,
  TOGGLE_CAMPAIGN_LAUNCHED,
  SET_SELECTION_DATA,
  SET_SUBGROUP_TAXON_TOGGLE,
  SET_SELECTION_VIEWER_STATE,
  SET_SELECTION_IS_LOADING,
  SET_OPEN_TAXONS_SUBGROUPS,
} from './constants';

export const setSelectionData = payload => ({
  type: SET_SELECTION_DATA,
  payload,
});

export const setSelectionIsLoading = payload => ({
  type: SET_SELECTION_IS_LOADING,
  payload,
});

export const toggleCampaignSuccess = payload => ({ type: TOGGLE_CAMPAIGN_LAUNCHED, payload });
export const resetControlsData = () => ({ type: RESET_CONTROLS_DATA });
export const toggleTaxonSubGroup = (key, flag) => ({ type: SET_SUBGROUP_TAXON_TOGGLE, payload: { key, flag } });
export const setSegmentationPopupState = payload => ({ type: SET_SELECTION_VIEWER_STATE, payload });
export const setOpenTaxonsSubgroups = payload => ({ type: SET_OPEN_TAXONS_SUBGROUPS, payload });
