import { __getCommonData } from '../../selectors';
import {
  BREAKPOINT_400,
  BREAKPOINT_502,
  BREAKPOINT_640,
  BREAKPOINT_800,
  BREAKPOINT_1004,
  BREAKPOINT_1080,
  BREAKPOINT_1280,
} from './constants';

/**
 * @private - Please restrain from using this selector in components
 * Use isScreenBelowXXX instead
 */
export const getBreakpoint = state => __getCommonData(state).breakpoint;


/**
 * Selectors for breakpoints, top resolution is INCLUDED in interval
  */
export const isScreenBelow400 = state => getBreakpoint(state) < BREAKPOINT_400;
export const isScreenBelow502 = state => getBreakpoint(state) < BREAKPOINT_502;
export const isScreenBelow640 = state => getBreakpoint(state) < BREAKPOINT_640;
export const isScreenBelow800 = state => getBreakpoint(state) < BREAKPOINT_800;
export const isScreenBelow1004 = state => getBreakpoint(state) < BREAKPOINT_1004;
export const isScreenBelow1080 = state => getBreakpoint(state) < BREAKPOINT_1080;
export const isScreenBelow1280 = state => getBreakpoint(state) < BREAKPOINT_1280;
