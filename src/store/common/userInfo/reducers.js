import update from 'immutability-helper';
import { SET_LOADING_USER_INFO, SET_USER_COMMON_INFO } from './constants';

const initialState = {
  data: {},
  isLoading: false,
  isEditingForm: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_COMMON_INFO: {
      const { payload } = action;
      return update(state, {
        $merge: {
          data: payload,
        },
      });
    }
    case SET_LOADING_USER_INFO: {
      const { payload } = action;
      return update(state, {
        $merge: {
          isLoading: payload,
        },
      });
    }
    default:
      return state;
  }
};
