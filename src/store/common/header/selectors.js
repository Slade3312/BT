import { createSelector } from 'reselect';

import { getHeaderData } from '../../selectors';

export const getLogoHref = state => getHeaderData(state).mainSiteLink;

export const getHelpLinkHref = state => getHeaderData(state).helpLinkHref;
export const getHelpLinkTitle = state => getHeaderData(state).helpLinkTitle;

export const getBlocksData = state => getHeaderData(state).blocks || {};
export const getProfileData = state => getBlocksData(state).profile || {};
export const getProfileText = state => getProfileData(state).title;
export const getProfileLinks = createSelector(getProfileData, data => data.links || []);

export const getMenuEntries = createSelector(getHeaderData, data => data.mainMenu || []);
