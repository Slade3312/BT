import { createSelector } from 'reselect';
import { deepTemplateTransformByContentType } from '../utils';
import { getTemplatesByDefault } from '../selectors';

const getErrorTemplate = state => getTemplatesByDefault(state).errors.ErrorNotification;

const getErrorTemplateNormalized = createSelector(
  getErrorTemplate,
  deepTemplateTransformByContentType,
);

export const getTemplate404error = state => getErrorTemplateNormalized(state)['404'];
export const getTemplate423error = state => getErrorTemplateNormalized(state)['423'];
export const getTemplate403error = state => getErrorTemplateNormalized(state)['403'];
export const getTemplate500error = state => getErrorTemplateNormalized(state)['500'];
export const getTemplate500ReleaseError = state => getErrorTemplateNormalized(state)['500release'];
