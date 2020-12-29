import { action, observable, computed, runInAction } from 'mobx';
import debouncePromise from 'debounce-promise';
import { requestCampaignDelete, requestMyCampaignsOrders } from 'requests/reports/request-campaign-orders';
import { MY_CAMPAIGNS_LIST_PAGE_SIZE } from 'store/MyCampaigns/constants';
import { filterValuable } from 'utils/fn';
import { viewToDtoCampaignOrdersFilters } from '../AudienceStatistic/reportData/utils';

const getCampaings = async (params, offset = 0) => {
  let res = null;
  await requestMyCampaignsOrders({ params, offset }).then(value => {
    res = value;
  });
  return res;
};


class MyCampaigns {
  @observable isLoading = false;
  @observable campaigns = [];
  @observable totalCount = 0;
  @observable filter = {};
  @observable nextPageUrl = null;

  debouncedMyCampaignsFiltersRequest = debouncePromise(this.syncInitialMyCampaigns, 500);

  @action syncInitialMyCampaigns = async () => {
    this.isLoading = true;
    const preparedParams = viewToDtoCampaignOrdersFilters(this.filter);
    try {
      const { results, count, next } = await getCampaings(filterValuable(preparedParams));
      runInAction(() => {
        this.campaigns = results;
        this.totalCount = count;
        this.nextPageUrl = next;
      });
    } finally {
      this.isLoading = false;
    }
  }

  @action syncMyCampaignsFilters = (value) => {
    this.filter = value;
    debouncePromise(this.syncInitialMyCampaigns, 500)();
  }

  @action syncAddMyCampaigns = async () => {
    this.isLoading = true;
    const preparedParams = viewToDtoCampaignOrdersFilters(this.filter);
    const currentOffset = this.campaigns.length;
    try {
      const { results, count, next } = await getCampaings(filterValuable(preparedParams), currentOffset);
      runInAction(() => {
        this.campaigns = this.campaigns.concat(results);
        this.totalCount = count;
        this.nextPageUrl = next;
      });
    } finally {
      this.isLoading = false;
    }
  }

  @action syncRemoveCampaign = async (campaignId) => {
    this.isLoading = true;
    try {
      await requestCampaignDelete({ campaignId });
      runInAction(() => {
        this.campaigns = this.campaigns.filter(el => el.id !== campaignId);
      });
    } finally {
      this.isLoading = false;
    }
  }

  @computed get hasNextPageData() {
    return this.nextPageUrl !== null;
  }

  @computed get nextCount() {
    const count = this.totalCount - this.campaigns.length;
    return count > MY_CAMPAIGNS_LIST_PAGE_SIZE ? MY_CAMPAIGNS_LIST_PAGE_SIZE : count;
  }
}

const myCampaigns = new MyCampaigns();

export default myCampaigns;
