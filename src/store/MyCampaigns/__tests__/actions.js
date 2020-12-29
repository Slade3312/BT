import { syncMyCampaignsFiltersRequest } from '../actions';

describe('async actions', () => {
  it('should call function syncMyCampaignsFiltersRequest correctly', () => {
    const mockRequestFunction = jest.fn();
    mockRequestFunction.mockReturnValue({ form: {} });

    syncMyCampaignsFiltersRequest(() => {}, mockRequestFunction).then(() => {
      expect(mockRequestFunction).toBeCalled();
    });
  });
});
