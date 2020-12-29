import { createSelector } from 'reselect';
import { getCurrentRelease } from '../../common/settings/selectors';
import { getNewCampaignData } from '../../selectors';
import { SELECTION_VIEWER_STATES } from './constants';

export const getControlsData = state => getNewCampaignData(state).controls;

/** strategy selectors */
const getSelectionData = state => getControlsData(state).selection || {};
export const getSelectionCount = state => getSelectionData(state).audience;
export const getSelectionId = state => getSelectionData(state).selection_id;
export const getSelectionIsLoading = state => getControlsData(state).isSelectionLoading;

const getPushSelectionData = state => getControlsData(state).pushSelection || {};
export const getPushSelectionCount = state => getPushSelectionData(state).audience;
export const getPushSelectionIsActive = state => getPushSelectionData(state).isActive;

export const isCampaignLaunched = state => getControlsData(state).isCampaignLaunched;
export const getOpenTaxonSubgroups = state => getControlsData(state).openTaxonsSubgroups;
export const getSelectionViewerState = state => getControlsData(state).selectionViewerState;

export const getSelectionViewerIsOpen = createSelector(
  getSelectionViewerState,
  popupState => popupState === SELECTION_VIEWER_STATES.OPENED,
);
export const getCreatedAtRelease = state => getControlsData(state).release;

export const getIsSameRelease = createSelector(
  [getCreatedAtRelease, getCurrentRelease],
  (currentRelease, createdAtRelease) => currentRelease === createdAtRelease,
);
