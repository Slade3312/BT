import { action, observable, runInAction, computed } from 'mobx';
import { getCampaignAndOrderStatusesOptions } from 'store/shared/campaign-and-orders/selectors.js';
import { CLIENT_INDUSTRY_API_URL } from 'requests/constants';
import { CLIENT_ORDERS_STATUSES_API_URL } from 'requests/orders/constants';
import { pollsStatusesTranslateMap } from 'store/common/ordersStatuses/constants';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { requestChannelTypes } from 'requests/campaigns';
import { filterNewCampaignChannels } from '../utils';
import { convertLegacyChannel } from '../NewCampaign/channels/utils';

const CONSTANTS_API_URL = '/constants/';

let uniqKey = 1;

export const COMMUNICATION_CHANNELS = [
  'voice-target',
  'internet',
  'target-internet',
  'push',
  'target-sms',
];

const DEFAULT_OPTION = { value: null, label: 'Все каналы' };

class Common {
    @observable industries = [];
    @observable.ref internetChannelIndustries = [];
    @observable constants = null;
    @observable.ref statusesOrder = [];
    @observable.ref statusesCampaign = []; // src/store/common/campaignStatuses/actions.js Где раньше получали пока ненашел(
    @observable channelTypesLoading = false;
    @observable.ref docTypes = [];
    @observable errorInfo = {
      statusCode: null,
      type: null,
      message: null,
    };
    @observable isAskCreateCampaignVisible = false;
    @observable notifications = [];
    @observable.ref channelTypes = [];

    @action set = (property, value) => {
      this[property] = value;
    }

    @action pushNotification = (type) => {
      const curNotification = {
        id: uniqKey++,
        notificationIndex: this.notifications.length,
        type,
      };

      this.notifications.push(curNotification);

      // get mobx observable pointer
      const lastNotification = this.notifications[this.notifications.length - 1];

      setTimeout(() => {
        runInAction(() => {
          this.removeNotification(lastNotification);
        });
      }, 7000);
    }

    @action removeNotification = notification => {
      this.notifications.remove(notification);
    }

    @action getDocTypes = async () => {
      const response = await axiosAuthorizedRequest({
        url: '/api/v1/client/company_docs/doc_types',
      });
      runInAction(() => { this.docTypes = response; });
    }

    @action setError = ({ statusCode, type, message }) => {
      this.errorInfo = {
        statusCode,
        type,
        message,
      };
    };

    getStatusesByTranslateMap(translateMap) {
      const options = [];

      options.push({ value: '', label: 'Не выбрано' });

      const translatedStatuses = this.statusesOrder.reduce((acc, curr) => {
        if (translateMap[curr.id]) {
          acc.push({
            label: translateMap[curr.id] || curr.label,
            value: curr.id,
          });
        }

        return acc;
      }, []);

      options.push(...translatedStatuses);

      return options;
    }

    @computed get getPollsStatusesOptions() {
      return this.getStatusesByTranslateMap(pollsStatusesTranslateMap);
    }

    @computed get docTypesList() {
      return this.docTypes?.length ? this.docTypes.map(item => { return { label: item, value: item }; }) : [{ value: '', label: '' }];
    }

    @computed get getOrderStatusesOptions() {
      return getCampaignAndOrderStatusesOptions(this.statusesCampaign, this.statusesOrder);
    }

    getStatuses = async () => {
      if (this.statusesOrder.length !== 0) return;
      const statuses = await axiosAuthorizedRequest({ url: CLIENT_ORDERS_STATUSES_API_URL });
      runInAction(() => { this.statusesOrder = statuses; });
    };

    @action getConstants = async () => {
      if (this.constants) return;
      const response = await axiosAuthorizedRequest({ url: CONSTANTS_API_URL });
      runInAction(() => { this.constants = response; });
    };

    getIndustries = async () => {
      if (this.industries.length) return;
      const response = await axiosAuthorizedRequest({ url: CLIENT_INDUSTRY_API_URL });
      runInAction(() => {
        this.industries = response.map(item => ({
          value: item.id,
          label: item.name_ru,
          icon: item.icon,
        }));
      });
    }

    getInternetChannelIndustries = async () => {
      if (this.internetChannelIndustries.length) return;
      const response = await axiosAuthorizedRequest({ url: '/api/v1/infotech/industries/' });
      runInAction(() => {
        this.internetChannelIndustries = response;
      });
    }

    getCampaignsChannelTypes = async () => {
      if (this.channelTypes.length) return;
      try {
        this.channelTypesLoading = true;
        const response = await requestChannelTypes();
        runInAction(() => {
          const newCampaignChannels = filterNewCampaignChannels(response);
          const preparedData = newCampaignChannels.map(convertLegacyChannel);
          this.channelTypes = preparedData;
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.set('channelTypesLoading', false);
      }
    }

    @computed get getChannelsOptions() {
      return [DEFAULT_OPTION, ...this.channelTypes.map(item => ({ label: item.name, value: item.channel_type_id }))];
    }

    @action getChannelInfoByUid = uid => {
      return this.channelTypes.find(item => {
        return item.channel_uid === uid;
      });
    }

    @computed get getChannelsCommunicationPage() {
      return this.channelTypes.filter(item => {
        return COMMUNICATION_CHANNELS.includes(item.channel_uid);
      });
    }
}

export default new Common();
