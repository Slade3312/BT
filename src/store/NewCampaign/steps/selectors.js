import { createSelector } from 'reselect';
import {
  getSubStepsFromTaxonGroups,
  getSegmentationViewerTaxonsGroups,
  getSegmentationChannelsTaxonsGroups,
} from '../taxonomy/groups/selectors';
import { getControlsData } from '../controls/selectors';
import { getSubStepsFromChannels } from '../channels/selectors';
import { STEP_SLUG_CHANNELS, STEP_SLUG_TAXONS } from '../constants';

import {
  getCampaignAudienceStep,
  getCampaignCommonStep,
  getCampaignTaxonsStep,
} from '../../common/templates/newCampaign/selectors';

const getMainStepsList = createSelector(
  getCampaignAudienceStep,
  getCampaignCommonStep,
  getCampaignTaxonsStep,

  (commonFirstSteps, taxonSteps, commonLastSteps) => [...commonFirstSteps, ...taxonSteps, ...commonLastSteps],
);

/** step selectors */
export const getRawCurrentStepSlug = state => getControlsData(state).currentStepSlug;
export const getFirstStepSlug = state => getMainStepsList(state)[0].slug;

/**
 * ATTENTION: READ BEFORE USE
 *
 * getting current slug/subSlug should only be used to pass context down,
 * in all the other places current step data is calculated via reduceSelectors
 * this is necessary for animations to work properly, being bound to static value
 */
export const getCurrentStepSlug = state => getRawCurrentStepSlug(state) || getFirstStepSlug(state);
export const getCurrentSubStepSlug = state => getControlsData(state).currentSubStepSlug;

const getSubSteps = createSelector(
  [getSubStepsFromTaxonGroups, getSubStepsFromChannels],
  (taxons, params) => ({
    [STEP_SLUG_TAXONS]: taxons,
    [STEP_SLUG_CHANNELS]: params,
  }),
);

const additingWebAndPhones = (array) => {
  const arrayithPhoneAndWeb = [...array];

  arrayithPhoneAndWeb.splice(
    1, 0,
    {
      items: [],
      slug: 'webSites',
      title: 'Веб-сайты',
      text: 'Доступно только для каналов SMS и PUSH',
    },
    {
      items: [],
      slug: 'phoneNumbers',
      title: 'Телефонные номера',
      text: 'Доступно только для каналов SMS и PUSH',
    },
  );

  return arrayithPhoneAndWeb;
};

export const getStepsList = createSelector(
  getMainStepsList,
  getSubSteps,
  (steps, subSteps) => steps.map(item => {
    if (item.slug === 'audience') {
      return ({
        ...item,
        subSteps: subSteps[item.slug] ? additingWebAndPhones(subSteps[item.slug]) : [],
      });
    }

    return ({
      ...item,
      subSteps: subSteps[item.slug] || [],
    });
  }),
);

const getPreparedGroupedData = (stepList, dataGroups) => {
  return ({
    ...stepList[0],
    groups: additingWebAndPhones(dataGroups),
    isEmpty: !dataGroups.length,
  });
};


export const getSegmentationViewerGroupedTaxons = createSelector(
  [getCampaignTaxonsStep, getSegmentationViewerTaxonsGroups],
  (stepList, dataGroups) => ({
    ...stepList[0],
    groups: dataGroups,
    isEmpty: !dataGroups.length,
  }),
);

export const getSegmentationChannelGroupedTaxons = createSelector(
  [getCampaignTaxonsStep, getSegmentationChannelsTaxonsGroups],
  getPreparedGroupedData,
);
