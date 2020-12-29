import { createSelector } from 'reselect';
import { deepTemplateTransformByContentType } from '../utils';
import { getTemplatesPopups } from '../selectors';

const getPopupsNormalized = createSelector(
  getTemplatesPopups,
  deepTemplateTransformByContentType,
);

export const getPrepareOrderStepTemplate = state => getPopupsNormalized(state).PrepareOrderStep;
export const getFeedbackPopupTemplate = state => getPopupsNormalized(state).FeedbackPopup;
export const getErrorCalculatePopupTemplate = state => getPopupsNormalized(state).ErrorCalculateCost;

export const getReplacementOrderStepsTemplate = state => getPrepareOrderStepTemplate(state).replacement;
