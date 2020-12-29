import { observable, runInAction, computed, reaction, action } from 'mobx';
import { CAMPAIGN_API_URL, CAMPAIGN_SORT_PARAMS } from 'requests/campaigns/constants';
import { CHANNEL_TYPE_FOCUS_TYPE_ID } from 'pages/AudienceStatistic/constants';
import { axiosAuthorizedRequest, composeAxiosDeleteRequest } from 'requests/helpers';
import { REPORT_LIST_PAGE_SIZE } from 'store/AudienceStatistic/campaignsList/constants';
import { FIELD_CAMPAIGN_NAME, FIELD_STATUS } from 'store/shared/campaign-and-orders/constants';
import { debounce } from 'utils/debounce';

class Audience {
    @observable campaignsList = [];
    @observable count = 0;
    @observable nextPageLink = null;
    @observable campaignsListLoading = false;
    @observable firstTimeLoaded = false;
    @observable totalCount = 0;
    // приходит из final-form
    @observable.shallow values = {
      [FIELD_CAMPAIGN_NAME]: '',
      [FIELD_STATUS]: '',
    }

    @action set = (value, property) => {
      this[value] = property;
    }

    @computed get nextCount() {
      const listSize = this.campaignsList.length;
      const remainingItems = this.count - listSize;
      if (remainingItems < REPORT_LIST_PAGE_SIZE && remainingItems > 0) return remainingItems;
      if (remainingItems <= 0) return 0;
      return REPORT_LIST_PAGE_SIZE;
    }

    getNextCampaigns = async () => {
      runInAction(() => {
        this.campaignsListLoading = true;
      });

      if (this.nextPageLink) {
        const list = await axiosAuthorizedRequest({
          url: this.nextPageLink,
        });
        runInAction(() => {
          this.campaignsList.push(...list.results);
          this.campaignsListLoading = false;
          this.count = list.count;
          this.nextPageLink = list.next;
        });
      }
    }

    getCampaigns = async () => {
      runInAction(() => {
        this.campaignsListLoading = true;
      });
      const campaignList = await axiosAuthorizedRequest({
        url: CAMPAIGN_API_URL,
        params: {
          limit: REPORT_LIST_PAGE_SIZE,
          channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID,
          sort: CAMPAIGN_SORT_PARAMS.CREATE_DATE_DESC,
          campaign_name: this.values[FIELD_CAMPAIGN_NAME] || undefined,
          order_status: this.values[FIELD_STATUS] || undefined,
        },
      });
      runInAction(() => {
        this.campaignsList = campaignList.results;
        this.campaignsListLoading = false;
        this.count = campaignList.count;
        this.nextPageLink = campaignList.next;
        if (!this.firstTimeLoaded) {
          this.totalCount = campaignList.count;
          this.firstTimeLoaded = true;
        }
        if (this.firstTimeLoaded && this.totalCount === 0) {
          this.totalCount = campaignList.count;
        }
      });
    }

    getCampaignsWithoutLoading = async () => {
      const campaignList = await axiosAuthorizedRequest({
        url: CAMPAIGN_API_URL,
        params: {
          limit: REPORT_LIST_PAGE_SIZE,
          channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID,
          sort: CAMPAIGN_SORT_PARAMS.CREATE_DATE_DESC,
          campaign_name: this.values[FIELD_CAMPAIGN_NAME] || undefined,
          order_status: this.values[FIELD_STATUS] || undefined,
        },
      });
      runInAction(() => {
        this.campaignsList = campaignList.results;
        this.count = campaignList.count;
        this.nextPageLink = campaignList.next;
        if (!this.firstTimeLoaded) {
          this.totalCount = campaignList.count;
          this.firstTimeLoaded = true;
        }
        if (this.firstTimeLoaded && this.totalCount === 0) {
          this.totalCount = campaignList.count;
        }
      });
    }

    @computed get isAnyOrderReady() {
      return this.campaignsList.some(({ orders }) => {
        return orders.length;
      });
    }

    @action getTotalCountByChannelType = async () => {
      const campaignList = await axiosAuthorizedRequest({
        url: CAMPAIGN_API_URL,
        params: {
          limit: 1,
          channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID,
        },
      });
      runInAction(() => {
        this.totalCount = campaignList.count;
      });
    }

    removeCampaignById = async (campaignId) => {
      runInAction(() => {
        this.campaignsListLoading = true;
      });

      await composeAxiosDeleteRequest({ url: `${CAMPAIGN_API_URL}${campaignId}` })();
      runInAction(() => {
        this.campaignsList = this.campaignsList.filter(item => item.id !== campaignId);
        this.campaignsListLoading = false;
      });
      return Promise.resolve();
    }
}

const audienceStore = new Audience();

const updateCampaigns = debounce(() => audienceStore.getCampaigns(), 500);
const updateCampaignsTotalCount = debounce(() => audienceStore.getTotalCountByChannelType(), 500);
reaction(
  () => audienceStore.values,
  () => updateCampaigns(),
);
reaction(
  () => audienceStore.values,
  () => updateCampaignsTotalCount(),
);
export default audienceStore;
