import myCampaignsReducer from '../myCampaignsReducer';
import {
  SET_MY_CAMPAIGNS_LIST_DATA,
  SET_MY_CAMPAIGNS_LIST_LOADING,
  OMIT_ORDER_FROM_CAMPAIGN,
  OMIT_CAMPAIGN_FROM_LIST,
} from '../constants';

describe('myCampaignsReducer', () => {
  it('should return the initial state', () => {
    expect(myCampaignsReducer(undefined, {})).toEqual({
      isListLoading: false,
      items: [],
      totalCount: 0,
    });
  });

  it('should handle SET_MY_CAMPAIGNS_LIST_DATA', () => {
    const testingObject = {
      items: [{ id: 1 }],
      totalCount: 5,
    };

    expect(myCampaignsReducer({}, {
      type: SET_MY_CAMPAIGNS_LIST_DATA,
      payload: testingObject,
    })).toEqual(testingObject);
  });

  it('should handle OMIT_ORDER_FROM_CAMPAIGN', () => {
    expect(myCampaignsReducer({
      isListLoading: true,
      items: [{ id: 1, orders: [{ id: 1 }, { id: 2 }] }],
      totalCount: 5,
    }, {
      type: OMIT_ORDER_FROM_CAMPAIGN,
      payload: {
        campaignId: '1',
        orderId: 1,
      },
    })).toEqual({
      isListLoading: true,
      items: [{ id: 1, orders: [{ id: 2 }] }],
      totalCount: 5,
    });
  });

  it('should handle OMIT_CAMPAIGN_FROM_LIST', () => {
    expect(myCampaignsReducer({
      items: [{ id: 1 }, { id: 2 }],
      totalCount: 5,
    }, {
      type: OMIT_CAMPAIGN_FROM_LIST,
      payload: { campaignId: 1 },
    })).toEqual({
      items: [{ id: 2 }],
      totalCount: 4,
    });
  });

  it('should handle OMIT_CAMPAIGN_FROM_LIST', () => {
    expect(myCampaignsReducer({
      isListLoading: false,
    }, {
      type: SET_MY_CAMPAIGNS_LIST_LOADING,
      payload: true,
    })).toEqual({ isListLoading: true });
  });
});
