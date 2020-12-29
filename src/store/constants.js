import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_VOICE,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_TARGET_INTERNET,
} from '../constants';

export const REQUEST_INPROGRESS = 'inprogress';
export const REQUEST_SUCCESS = 'success';
export const REQUEST_ERROR = 'error';

/**
 * Lists request statuses that should prevent duplicate requests from firing,
 * includes in progress (to prevent another request),
 *  and success (cause then another request is not required)
 */
export const RequestStatusList = [REQUEST_INPROGRESS, REQUEST_SUCCESS, REQUEST_ERROR];
export const RequestFiredStatusList = [REQUEST_INPROGRESS, REQUEST_SUCCESS];

/** it more cases it must be used to put the empty object instead of undefined or null
 to prevent crush for picking empty props in related selector
 if we will pass own "{}" object every time then seriously problem for optimization appears
 for all connected props to corresponding selectors that returns "{}"
 example of problem: createReduceSelector will pass new "{}" every time when we call it
 * */
export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY = [];

export const TAXON_KEYS = {
  DEFAULT: 'default',
  JOB_GEO: 'job_geo',
  HOME_GEO: 'home_geo',
  WEEKEND_GEO: 'weekend_geo',
  ANY_LOCATION: 'any_location',
  GEO_TYPE: 'geo_type',
  GEO_POINTS: 'geo_points',
};

export const NEW_CAMPAIGN_CHANNELS = [
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_VOICE,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_TARGET_INTERNET,
];
