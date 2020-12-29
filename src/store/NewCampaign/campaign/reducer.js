import {
  SET_CAMPAIGN_LOADER,
  SET_PROMOCODE_DATA,
  RESET_NEW_CAMPAIGN_DATA,
  ERASE_PROMOCODES,
} from './constants';

const initialState = {
  loaders: {},
  promocodeData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CAMPAIGN_LOADER: {
      const { namespace, flag } = action.payload;
      return {
        ...state,
        loaders: {
          ...state.loaders,
          [namespace]: flag,
        },
      };
    }
    case SET_PROMOCODE_DATA: {
      const { data, promocodeType } = action.payload;
      return {
        ...state,
        promocodeData: {
          ...state.promocodeData,
          [promocodeType]: data,
        },
      };
    }
    case ERASE_PROMOCODES: {
      return { ...state, promocodeData: {} };
    }
    case RESET_NEW_CAMPAIGN_DATA: {
      return {
        ...state,
        promocodeData: {},
      };
    }
    default: {
      return state;
    }
  }
}
