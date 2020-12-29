import * as actions from '../actions';
import {
  SET_MY_CAMPAIGNS_LIST_DATA,
  SET_MY_CAMPAIGNS_LIST_LOADING,
  OMIT_ORDER_FROM_CAMPAIGN,
  OMIT_CAMPAIGN_FROM_LIST,
} from '../../constants';

describe('actions', () => {
  it('should create a setMyCampaignsListData action', () => {
    const payload = { items: [], totalCount: 10, pageNumber: 1 };

    const expectedAction = {
      type: SET_MY_CAMPAIGNS_LIST_DATA,
      payload,
    };
    expect(actions.setMyCampaignsListData(payload)).toEqual(expectedAction);
  });

  it('should create a setMyCampaignsDataLoading action', () => {
    const payload = true;

    const expectedAction = {
      type: SET_MY_CAMPAIGNS_LIST_LOADING,
      payload,
    };
    expect(actions.setMyCampaignsDataLoading(payload)).toEqual(expectedAction);
  });

  it('should create a omitOrderFromCampaignByIds action', () => {
    const payload = { campaignId: 1, orderId: 1 };

    const expectedAction = {
      type: OMIT_ORDER_FROM_CAMPAIGN,
      payload,
    };
    expect(actions.omitOrderFromCampaignByIds(payload)).toEqual(expectedAction);
  });

  it('should create a omitCampaignFromList action', () => {
    const payload = { campaignId: 1 };

    const expectedAction = {
      type: OMIT_CAMPAIGN_FROM_LIST,
      payload,
    };
    expect(actions.omitCampaignFromList(1)).toEqual(expectedAction);
  });
});
