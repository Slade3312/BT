import update from 'immutability-helper';

import {
  SET_SELECTION_DATA,
  SET_PUSH_SELECTION_DATA,
  RESET_CONTROLS_DATA,
  TOGGLE_CAMPAIGN_LAUNCHED,
  SET_SUBGROUP_TAXON_TOGGLE,
  SET_SELECTION_VIEWER_STATE,
  SELECTION_VIEWER_STATES,
  SET_SELECTION_IS_LOADING,
  SET_OPEN_TAXONS_SUBGROUPS,
} from './constants';

const initialState = {
  selection: null,
  isSelectionLoading: false,
  selectionViewerState: SELECTION_VIEWER_STATES.CLOSED,
  pushSelection: {},
  openTaxonsSubgroups: [],
  /** show success */
  isCampaignLaunched: false,
  /** release number storage was created at */
  release: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SELECTION_DATA:
      return { ...state, selection: action.payload };
    case SET_PUSH_SELECTION_DATA:
      return { ...state, pushSelection: action.payload };
    case SET_SELECTION_IS_LOADING:
      return { ...state, isSelectionLoading: action.payload };
    case RESET_CONTROLS_DATA:
      return initialState;
    case TOGGLE_CAMPAIGN_LAUNCHED: {
      const { payload } = action;
      return { ...state, isCampaignLaunched: payload };
    }
    case SET_OPEN_TAXONS_SUBGROUPS: {
      return { ...state, openTaxonsSubgroups: action.payload };
    }
    case SET_SUBGROUP_TAXON_TOGGLE: {
      const {
        payload: { key, flag },
      } = action;
      return update(state, {
        openTaxonsSubgroups: flag
          ? {
            $push: [key],
          }
          : { $splice: [[state.openTaxonsSubgroups.indexOf(key), 1]] },
      });
    }
    case SET_SELECTION_VIEWER_STATE: {
      const { payload } = action;
      return { ...state, selectionViewerState: payload };
    }
    default:
      return state;
  }
}
