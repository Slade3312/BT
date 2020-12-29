import { SET_ORDERS_STATUSES } from 'store/common/ordersStatuses/constants';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS_STATUSES: {
      return action.payload;
    }
    default:
      return state;
  }
};
