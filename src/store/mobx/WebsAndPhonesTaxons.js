import { action, computed, observable, reaction, runInAction, toJS } from 'mobx';
import { navigate } from '@reach/router';
import { extractError } from 'utils/errors';
import { debounce } from 'utils/debounce';
import { getStore } from 'store/index';
import {
  customSegmentDeleteAllFilesRequest,
  customSegmentDeleteFileRequest,
  customSegmentLoadFileRequest,
  customSegmentRequest,
} from 'requests/campaigns';
import { axiosAuthorizedRequest, composeAxiosPostRequest } from 'requests/helpers';
import { CAMPAIGN_API_URL } from 'requests/campaigns/constants';

import { calculateAllOrderEventsCount } from '../NewCampaign/steps/actions/update';
import Templates from './Templates';
import NewCampaign from './NewCampaign';
import { normalizeError } from './utils/reportsAndCreateReport';

const defaultPhoneNumbersTaxon = {
  id: '',
  manuallyNumbers: [],
  event_depth: null,
  is_active: false,
};

const defaultWebSitesTaxon = {
  id: '',
  manuallySites: [],
  event_depth: null,
  is_active: false,
};

class WebsAndPhonesTaxons {
  @observable isShowMinWebsitesError = false;
  @observable isShowMinPhoneNumbersError = false;
  @observable shouldCheckForBlackList = false;

  @observable loadingFormWebSites = false;
  @observable loadingFormPhones = false;

  @observable errorPhoneFiles = false;
  @observable errorWebSiteFiles = false;

  @observable phoneNumbersRequestError = '';
  @observable webSitesRequestError = '';

  @observable isShowingLoaderModal = false;
  @observable callIntervalRequests = '';

  @observable phoneNumbersTaxon = { ...defaultPhoneNumbersTaxon };
  @observable webSitesTaxon = { ...defaultWebSitesTaxon };
  @observable webSitesOnOfLine = null;
  @observable phonesOnOfLine = 'offline';

  @observable isPhonesChanged = false;
  @observable isWebSitesCalculating = false;

  @observable blackList = null;

  @observable depthOptions = null;
  @observable delayOptions = null;

  @observable eventsDepths = null;
  @observable intervalRequestAttempts = 0;

  @observable phonesOnServerSide = null;
  @observable webSitesOnServerSide = null;

  @observable manuallyAddedWebSitesError = '';
  @observable manuallyAddedNumbersError = '';

  @action set = (value, data) => {
    this[value] = data;
  };

  @action resetAllCustomSegments = () => {
    this.phoneNumbersTaxon = { ...defaultPhoneNumbersTaxon };
    this.phonesOnOfLine = 'offline';
    this.errorPhoneFiles = '';
    this.phoneNumbersRequestError = '';
    this.manuallyAddedNumbersError = '';
    this.isShowMinPhoneNumbersError = false;

    this.webSitesTaxon = { ...defaultWebSitesTaxon };
    this.webSitesOnOfLine = 'offline';
    this.webSitesRequestError = '';
    this.errorWebSiteFiles = '';
    this.manuallyAddedWebSitesError = '';
    this.isShowMinWebsitesError = false;

    this.isPhonesChanged = false;
    this.isWebSitesCalculating = false;
  }

  @action resetPhoneNumbersTaxon = () => {
    this.clearAllManuallyAddedPhonesOnServer();

    this.phoneNumbersTaxon.manuallyNumbers = [];
    this.phoneNumbersTaxon.event_depth = null;
    this.phonesOnOfLine = 'offline';

    this.phoneNumbersRequestError = '';
    this.manuallyAddedNumbersError = '';
    this.errorPhoneFiles = '';

    this.isShowMinPhoneNumbersError = false;
    this.isPhonesChanged = false;
  }

  @action resetWebSitesTaxon = () => {
    this.clearAllManuallyAddedWebSitesOnServer();

    this.webSitesTaxon.manuallySites = [];
    this.webSitesTaxon.event_depth = null;
    this.webSitesOnOfLine = 'offline';

    this.errorWebSiteFiles = '';
    this.webSitesRequestError = '';
    this.manuallyAddedWebSitesError = '';

    this.isShowMinWebsitesError = false;
    this.isWebSitesCalculating = false;
  }

  @computed get checkForPhoneNumbersMinValidation() {
    const { minCount } = Templates.getNewCampaignTemplate('PhoneNumbersTaxon');
    return this.manuallyPhoneNumbersCount < +minCount;
  }

  @computed get showMinWebsitesError() {
    const { minCount } = Templates.getNewCampaignTemplate('WebSitesTaxon');
    return this.manuallyWebSitesCount < +minCount && this.isShowMinWebsitesError;
  }

  @computed get webSitesTaxonCountLeft() {
    return (maxCount) => {
      const result = maxCount - this.manuallyWebSitesCount;
      return result < 0 ? 0 : result;
    };
  }

  @computed get shouldExecutePhonesClear() {
    const { minCount } = Templates.getNewCampaignTemplate('PhoneNumbersTaxon');
    return this.manuallyPhoneNumbersCount < +minCount &&
      this.phoneNumbersTaxon.id &&
      NewCampaign.currentCampaign.id;
  }

  @computed get shouldExecuteWebsiteClear() {
    const { minCount } = Templates.getNewCampaignTemplate('WebSitesTaxon');
    return this.manuallyWebSitesCount < +minCount &&
      this.webSitesTaxon.id &&
      NewCampaign.currentCampaign.id;
  }

  @computed get phoneNumbersTaxonCountLeft() {
    return (maxCount) => {
      const result = maxCount - this.manuallyPhoneNumbersCount;
      return result < 0 ? 0 : result;
    };
  }

  @computed get websitesTaxonCountLeftNegative() {
    const { maxCount } = Templates.getNewCampaignTemplate('WebSitesTaxon');
    const result = maxCount - this.manuallyWebSitesCount;
    return result;
  }

  @computed get phoneNumbersTaxonCountLeftNegative() {
    const { maxCount } = Templates.getNewCampaignTemplate('PhoneNumbersTaxon');
    const result = maxCount - this.manuallyPhoneNumbersCount;
    return result;
  }

  @computed get formattedPhoneNumbers() {
    if (!this?.phoneNumbersTaxon?.manuallyNumbers.length) {
      return [];
    }

    return this.phoneNumbersTaxon.manuallyNumbers.map((number) => {
      if (+number[0] === 7 && number.length >= 10) return `+${number}`;
      else if (number.length < 10 && number.length > 4) return `+7${number}`;
      //  if (number[0] === '+' && number.length >= 10 || +number[0] === 8)
      return number;
    });
  }

  @computed get manuallyAddedSitesList() {
    if (this?.webSitesTaxon?.manuallySites?.length) {
      return this.webSitesTaxon.manuallySites.map(item => ({ label: item, value: item }));
    }
    return [];
  }

  @computed get manuallyPhoneNumbersCount() {
    return this.phoneNumbersTaxon?.manuallyNumbers?.length;
  }

  @computed get manuallyWebSitesCount() {
    return this.webSitesTaxon?.manuallySites?.length;
  }

  @action loadCustomSegmentEventsDepth = async () => {
    this.loadingFormWebSites = true;
    this.loadingFormPhones = true;

    try {
      const eventsDepths = await axiosAuthorizedRequest({ url: `${CAMPAIGN_API_URL}custom_segment_event_depth/` });

      runInAction(() => {
        this.eventsDepths = eventsDepths;

        this.depthOptions = eventsDepths?.offline?.map(element => ({
          value: element.id,
          label: element.name,
        }));

        this.delayOptions = eventsDepths?.online?.map(element => ({
          value: element.id,
          label: element.name,
          tooltip: element?.description || '',
        }));

        if (!this.webSitesTaxon.event_depth) {
          this.webSitesTaxon.event_depth = this.depthOptions[0]?.value;
        }

        if (!this.phoneNumbersTaxon.event_depth) {
          this.phoneNumbersTaxon.event_depth = this.depthOptions[0]?.value;
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingFormWebSites = false;
      this.loadingFormPhones = false;
    }
  }

  @action loadBlackListVerifying = async () => {
    let timerId = null;
    let responseData = null;

    this.loadingFormWebSites = true;

    try {
      timerId = setTimeout(() => {
        if (!responseData) this.isShowingLoaderModal = true;
        else clearTimeout(timerId);
      }, 2000);

      responseData = await composeAxiosPostRequest({
        url: `${CAMPAIGN_API_URL}${NewCampaign.currentCampaign.id}/custom_segment/${this.webSitesTaxon.id}/blacklist_verifying/`,
      });

      runInAction(() => {
        this.blackList = responseData?.blacklistHost;
        if (responseData?.blacklistHost.length) {
          this.isShowMinWebsitesError = true;
          this.set('manuallyAddedWebSitesError', 'Удалите сайты, недоступные для подбора аудитории');

          if (window.location.pathname !== `/new-campaign/${NewCampaign.currentCampaign.id}/audience/webSites`) {
            navigate(`/new-campaign/${NewCampaign.currentCampaign.id}/audience/webSites`);
          }
        }
        this.shouldCheckForBlackList = false;
      });
    } catch (e) {
      this.set('webSitesRequestError', extractError(e).fullText);
    } finally {
      this.isShowingLoaderModal = false;
      this.loadingFormWebSites = false;
      this.loadingFormPhones = false;

      clearTimeout(timerId);
    }
  }

  @action defineCurrentOnOfLine = async () => {
    if (!this.eventsDepths || !this.depthOptions || !this.delayOptions) await this.loadCustomSegmentEventsDepth();

    if (!this.webSitesTaxon.event_depth) {
      this.webSitesTaxon.event_depth = this.depthOptions[0]?.value;
    }

    if (!this.phoneNumbersTaxon.event_depth) {
      this.phoneNumbersTaxon.event_depth = this.depthOptions[0]?.value;
    }

    if (this.eventsDepths?.offline.find((item) => item.id === this?.phoneNumbersTaxon?.event_depth)) {
      this.set('phonesOnOfLine', 'offline');
    } else if (
      this.eventsDepths?.online.find((item) => item.id === this?.phoneNumbersTaxon?.event_depth)
    ) {
      this.set('phonesOnOfLine', 'online');
    }

    if (this.eventsDepths?.offline.find((item) => item.id === this?.webSitesTaxon?.event_depth)) {
      this.set('webSitesOnOfLine', 'offline');
    } else if (
      this.eventsDepths?.online.find((item) => item.id === this?.webSitesTaxon?.event_depth) &&
      this.webSitesTaxon?.is_active
    ) {
      this.set('webSitesOnOfLine', 'online');
    }
  };

  @action webSitesHandleFilesAdded = async (files) => {
    const { maxCount } = Templates.getNewCampaignTemplate('WebSitesTaxon');
    this.set('loadingFormWebSites', true);

    const results = await Promise.allSettled(Array.from(files)
      .map(file => customSegmentLoadFileRequest({
        data: file,
        campaignId: NewCampaign.currentCampaign.id,
        segmentId: this.webSitesTaxon.id,
        event_depth: this.webSitesTaxon.event_depth,
      })));
    this.set('loadingFormWebSites', false);

    const firstRejectedResult = results.find(res => res.reason);
    const successResults = results.filter(res => res.status === 'fulfilled').map(res => res.value);

    if (firstRejectedResult) {
      const { fullText } = extractError(firstRejectedResult.reason);
      this.set('loadingFormWebSites', false);
      this.set('errorWebSiteFiles', normalizeError(fullText, maxCount).web);
    } else {
      this.set('errorWebSiteFiles', false);
    }

    successResults.forEach((item) => {
      const mergingItems = [...item?.items].reduce((curResult, reducedItem) => {
        if (!curResult.includes(reducedItem)) curResult.push(reducedItem);
        return curResult;
      }, this.webSitesTaxon.manuallySites);

      this.webSitesTaxon.manuallySites = mergingItems;
      const startMergingBlackList = this.blackList ? toJS(this.blackList) : [];

      if (item.blacklist.length && this.webSitesOnOfLine === 'online') {
        const mergingBlackList = item?.blacklist.reduce((blacklistRes, blackListItem) => {
          if (!blacklistRes.includes(blackListItem)) blacklistRes.push(blackListItem);
          return blacklistRes;
        }, startMergingBlackList);

        if (this.blackList) this.blackList.push(...mergingBlackList);
        else this.blackList = mergingBlackList;

        this.isShowMinWebsitesError = true;
        this.set('manuallyAddedWebSitesError', 'Удалите сайты, недоступные для подбора аудитории');
      }
    });
  };

  @action addWebSitesFiles = (value) => {
    this.webSitesTaxon.files.push(value);
  }

  @computed get hasSegmentsStrategy() {
    return this.webSitesTaxon?.manuallySites?.length >= 5 ||
      this.phoneNumbersTaxon?.manuallyNumbers?.length >= 5;
  }

  @action phoneHandleFilesAdded = async (files) => {
    const { maxCount } = Templates.getNewCampaignTemplate('PhoneNumbersTaxon');
    this.set('loadingFormPhones', true);

    const results = await Promise.allSettled(Array.from(files)
      .map(file => customSegmentLoadFileRequest({
        data: file,
        campaignId: NewCampaign.currentCampaign.id,
        segmentId: this.phoneNumbersTaxon.id,
        event_depth: this.phoneNumbersTaxon.event_depth,
      })));

    this.set('loadingFormPhones', false);

    const firstRejectedResult = results.find(res => res.reason);
    const successResults = results.filter(res => res.status === 'fulfilled').map(res => res.value);

    if (firstRejectedResult) {
      const { fullText } = extractError(firstRejectedResult.reason);
      this.set('errorPhoneFiles', normalizeError(fullText, maxCount).phones);
    } else {
      this.set('errorPhoneFiles', false);
    }

    successResults.forEach((item) => {
      let newItems = [...item?.items].reduce((curResult, newItem) => {
        if (!curResult.includes(newItem)) {
          curResult.push(newItem);
        }
        return curResult;
      }, this.phoneNumbersTaxon.manuallyNumbers);

      newItems = newItems.map((number) => {
        if (+number[0] === 7 && number.length === 11) return `+${number}`;
        else if (number.length === 10 && +number[0] === 9) return `+7${number}`;
        else if (+number[0] === 8 && number.length === 11) return `+7${number.slice(1)}`;
        return number;
      });

      this.phoneNumbersTaxon.manuallyNumbers = newItems;
    });
  };

  @action removePhoneNumbersFile = async ({ fileId, campaignId, customSegmentId }) => {
    try {
      await customSegmentDeleteFileRequest({ fileId, campaignId, customSegmentId })();
      runInAction(() => {
        this.phoneNumbersTaxon.files =
          this.phoneNumbersTaxon.files.filter(item => item.id !== fileId);
      });
      this.checkForNumberManuallyPhones();
    } catch (e) {
      console.error(e);
    }
  }

  @action checkForNumberManuallySites = () => {
    // при удалении файлов надо проверять количество вручную введённых сайтов,
    // если меньше минимального количества, то чистить их на стороне сервера
    const { minCount } = Templates.getNewCampaignTemplate('WebSitesTaxon');
    if (this.manuallyWebSitesCount < +minCount) {
      this.clearAllManuallyAddedWebSitesOnServer();
    }
  }

  @action removeWebSitesFile = async ({ fileId, campaignId, customSegmentId }) => {
    try {
      await customSegmentDeleteFileRequest({ fileId, campaignId, customSegmentId })();

      runInAction(() => {
        this.webSitesTaxon.files =
          this.webSitesTaxon.files.filter(item => item.id !== fileId);
      });
      this.checkForNumberManuallySites();
    } catch (e) {
      console.error(e);
    }
  }

  @action removeWebSitesAllFiles = async ({ campaignId, customSegmentId }) => {
    try {
      await customSegmentDeleteAllFilesRequest({ campaignId, customSegmentId })();

      runInAction(() => {
        this.webSitesTaxon.files = [];
      });
      this.checkForNumberManuallySites();
    } catch (e) {
      console.error(e);
    }
  }

  @action checkForNumberManuallyPhones = () => {
    const { minCount } = Templates.getNewCampaignTemplate('PhoneNumbersTaxon');
    if (this.manuallyPhoneNumbersCount < +minCount) {
      this.clearAllManuallyAddedPhonesOnServer();
    }
  }

  @action removePhoneNumbersAllFiles = async ({ campaignId, customSegmentId }) => {
    try {
      await customSegmentDeleteAllFilesRequest({ campaignId, customSegmentId })();

      runInAction(() => {
        this.phoneNumbersTaxon.files = [];
      });
      this.checkForNumberManuallyPhones();
    } catch (e) {
      console.error(e);
    }
  }

  @action addManuallySites = (value) => {
    this.webSitesTaxon.manuallySites.push(value);
  }

  @action addPhoneNumbersFiles = (value) => {
    this.phoneNumbersTaxon.files.push(value);
  }

  @action updateCustomSegmentInfo = async ({ type } = {}) => {
    try {
      await axiosAuthorizedRequest({
        method: 'POST',
        url: `/api/v1/client/campaigns/${NewCampaign.currentCampaign.id}/update_custom_segment/`,
      });

      if (type === 'sites') this.isWebSitesCalculating = true;
      else if (type === 'phones') this.isPhonesChanged = true;
    } catch (e) {
      if (type === 'sites') this.isWebSitesCalculating = false;
      this.intervalRequestAttempts = 100;
      NewCampaign.set('audienceError', extractError(e).fullText);
    }
  };

  @action updateWebSitesSegmentInfo = async () => {
    this.set('loadingFormWebSites', true);
    try {
      await customSegmentRequest({
        segmentId: this.webSitesTaxon.id,
        campaignId: NewCampaign.currentCampaign.id,
        data: {
          event_depth: this.webSitesTaxon.event_depth,
          data: {
            sites: this.webSitesTaxon.manuallySites,
          },
        },
      });
    } catch (e) {
      this.set('webSitesRequestError', extractError(e).fullText);
    } finally {
      this.set('loadingFormWebSites', false);
    }
  };

  @computed get isOnlineTriggersEnabled() {
    return (this.webSitesOnOfLine !== 'offline' || this.phonesOnOfLine !== 'offline') && this.hasSegmentsStrategy;
  }

  @action updatePhonesSegmentInfo = async () => {
    const callDirection = this.phoneNumbersTaxon.callDirection
      ? { [this.phoneNumbersTaxon.callDirection]: true }
      : { outgoing: true, incoming: true };

    this.set('loadingFormPhones', true);

    try {
      await customSegmentRequest({
        segmentId: this.phoneNumbersTaxon.id,
        campaignId: NewCampaign.currentCampaign.id,
        data: {
          event_depth: this.phoneNumbersTaxon.event_depth,
          data: {
            phones: this.formattedPhoneNumbers,
            ...callDirection,
          },
        },
      });
    } catch (e) {
      this.set('phoneNumbersRequestError', extractError(e).fullText);
    } finally {
      this.set('loadingFormPhones', false);
    }
  };

  clearAllManuallyAddedWebSitesOnServer = async () => {
    // метод нужен для того, чтобы удалять невалидное кол-во сайтов со стороны сервера
    try {
      await customSegmentRequest({
        segmentId: this.webSitesTaxon.id,
        campaignId: NewCampaign.currentCampaign.id,
        data: {
          event_depth: this.webSitesTaxon.event_depth,
          data: {
            sites: [],
          },
        },
      });
      this.set('webSitesOnServerSide', []);
    } catch (e) {
      console.log(e);
    }
  }

  clearAllManuallyAddedPhonesOnServer = async () => {
    try {
      await customSegmentRequest({
        segmentId: this.phoneNumbersTaxon.id,
        campaignId: NewCampaign.currentCampaign.id,
        data: {
          event_depth: this.phoneNumbersTaxon.event_depth,
          data: {
            phones: [],
          },
        },
      });
      this.set('phonesOnServerSide', []);
      this.isPhonesChanged = false;
    } catch (e) {
      console.log(e);
    }
  }
}

const websAndPhonesTaxons = new WebsAndPhonesTaxons();

const calcAllEventsDebounced = debounce(() => getStore().dispatch(calculateAllOrderEventsCount()), 400);

reaction(() => ({
  sitesCount: websAndPhonesTaxons.manuallyWebSitesCount,
  numbersCount: websAndPhonesTaxons.manuallyPhoneNumbersCount,
}), () => {
  calcAllEventsDebounced();
});

export default websAndPhonesTaxons;
