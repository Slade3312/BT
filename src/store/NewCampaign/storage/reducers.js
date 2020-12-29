import update from 'immutability-helper';
import {
  SYNC_CAMPAIGN_DATA,
  SYNC_ORDER_DATA,
  SYNC_TAXONS_DATA,
  RESET_TAXON_VALUE,
  RESET_STORAGE_DATA,
  SET_CAMPAIGN_ID,
  SET_ORDER_ID,
  SET_ORDER_EVENTS,
  TOGGLE_CHANNEL,
  SET_CAMPAIGN_GOAL,
  RESET_GEO_TAXON_VALUE,
  SET_ORDER_IS_EMPTY,
  SET_ORDER_IS_ACTIVE,
  SET_ORDER_BUDGET,
} from '../constants';
import { ORDER_ACTIVE_FIELD } from '../channels/constants';

const initialState = {
  campaign: {
    id: null,
  },
  taxons: {},
  channels: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SYNC_CAMPAIGN_DATA:
      return update(state, {
        campaign: { $merge: action.payload },
      });
    case SET_CAMPAIGN_ID:
      return update(state, {
        campaign: {
          id: { $set: action.payload },
        },
      });
    case SET_CAMPAIGN_GOAL:
      return update(state, {
        campaign: {
          goal: { $set: action.payload },
        },
      });
    case SYNC_TAXONS_DATA:
      return update(state, {
        taxons: { $set: action.payload },
      });
    case SYNC_ORDER_DATA: {
      const { channelType, payload } = action;
      const prevState = { ...state.channels[channelType] };
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...prevState,
            ...payload,
          },
        },
      };
    }
    case TOGGLE_CHANNEL: {
      const { channelType, payload } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...state.channels[channelType],
            [ORDER_ACTIVE_FIELD]: payload,
          },
        },
      };
    }
    case SET_ORDER_EVENTS: {
      const { channelType, payload } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...state.channels[channelType],
            ...payload,
          },
        },
      };
    }
    case SET_ORDER_IS_EMPTY: {
      const { channelType, payload } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...state.channels[channelType],
            isEmpty: payload,
          },
        },
      };
    }
    case SET_ORDER_BUDGET: {
      const { channelType, payload } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...state.channels[channelType],
            budget: payload,
          },
        },
      };
    }
    case SET_ORDER_IS_ACTIVE: {
      const { channelType, payload } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelType]: {
            ...state.channels[channelType],
            isActive: payload,
          },
        },
      };
    }
    case SET_ORDER_ID: {
      const { channelType, payload } = action;
      return update(state, {
        channels: {
          [channelType]: {
            id: { $set: payload },
          },
        },
      });
    }
    case RESET_TAXON_VALUE: {
      const { value, key } = action.payload;
      const taxons = { ...state.taxons };
      const taxon = taxons[key];

      if (typeof taxon === 'object') {
        taxons[key] = taxon.filter(t => t !== value);
      } else {
        taxons[key] = null;
      }

      return update(state, {
        taxons: { $merge: taxons },
      });
    }
    case RESET_GEO_TAXON_VALUE: {
      const { value, key } = action.payload;
      const taxons = { ...state.taxons };
      const taxon = taxons[key];

      const filterRemovedTaxon = item => item.lat !== value[0] && item.lng !== value[1];

      taxons[key] = taxon.filter(filterRemovedTaxon);

      if (taxons.job_geo) {
        taxons.job_geo = taxon.filter(filterRemovedTaxon);
      }
      if (taxons.home_geo) {
        taxons.home_geo = taxon.filter(filterRemovedTaxon);
      }
      if (taxons.weekend_geo) {
        taxons.weekend_geo = taxon.filter(filterRemovedTaxon);
      }

      return update(state, {
        taxons: { $merge: taxons },
      });
    }
    case RESET_STORAGE_DATA: {
      return initialState;
    }
    default:
      return state;
  }
}
