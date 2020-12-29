import {
  SET_MY_CAMPAIGNS_LIST_DATA,
  SET_MY_CAMPAIGNS_LIST_LOADING,
  OMIT_ORDER_FROM_CAMPAIGN,
  OMIT_CAMPAIGN_FROM_LIST,
} from './constants';

const initialState = {
  isListLoading: false,
  items: [],
  totalCount: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_MY_CAMPAIGNS_LIST_DATA: {
      const { items, totalCount } = action.payload;
      return {
        ...state,
        items,
        totalCount,
      };
    }
    case OMIT_ORDER_FROM_CAMPAIGN: {
      const { campaignId, orderId } = action.payload;
      const newItems = state.items.map((item) => {
        if (String(item.id) === campaignId) {
          const newOrders = item.orders.filter(order => order.id !== orderId);

          return { ...item, orders: newOrders };
        }

        return item;
      });

      return {
        ...state,
        items: newItems,
      };
    }
    case OMIT_CAMPAIGN_FROM_LIST: {
      const { campaignId } = action.payload;
      return {
        ...state,
        items: state.items.filter(elem => elem.id !== campaignId),
        totalCount: state.totalCount - 1,
      };
    }
    case SET_MY_CAMPAIGNS_LIST_LOADING: {
      return {
        ...state,
        isListLoading: action.payload,
      };
    }
    default:
      return state;
  }
}
