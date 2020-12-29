import { BREAKPOINT_1004, BREAKPOINT_SET } from './constants';

const initialState = BREAKPOINT_1004;

/**
 * Should only be called when breakpoint actually changes,
 * all that logic is up to AdaptivityProvider implementation
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case BREAKPOINT_SET: {
      const { value } = action;
      return value;
    }
    default:
      return state;
  }
}
