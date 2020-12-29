import { observable, action, computed, runInAction, reaction } from 'mobx';
import moment from 'moment';
import axios from 'axios';
import {
  axiosAuthorizedRequest,
  composeAxiosPostRequest,
} from 'requests/helpers';
import { debounce } from 'utils/debounce';
import Common from './Common';

export const SCREEN = {
  INDUSTRY: 'industry',
  PARTNERSHIP: 'partnership',
  BUSINESS: 'business',
  ITEM: 'item',
};

export const FIRSTSTEP = {
  NAME: 'name',
  PHONE: 'phone',
  ADDRESS: 'address',
  INDUSTRY: 'industry',
  SITE: 'site',
  DESCRIPTION: 'description',
};

export const SECONDSTEP = {
  NAME: 'name',
  DESCRIPTION: 'description',
  ACTION_SIZE: 'discount_size',
  DISCOUNT_TYPE: 'discount_type',
  START_DATE: 'date_start',
  END_DATE: 'date_end',
};

export const MY_BUSINESS_TABS = {
  ACTIVE_ACTIONS: 'actions',
  ACTIVE_PARTNERSHIPS: 'active_partnerships',
  NEW_REQUESTS: 'new_requests',
};

export const MY_BUSINESS_SCREEN = {
  BUSINESSES_LIST: 'businesses_list',
  CONTROLS: 'controls',
  INCOMING_REQUEST: 'incoming_request',
};

const defaultFirstStepValues = {
  [FIRSTSTEP.NAME]: '',
  [FIRSTSTEP.PHONE]: '',
  [FIRSTSTEP.SITE]: '',
  point: '',
  address: '',
  [FIRSTSTEP.DESCRIPTION]: '',
  [FIRSTSTEP.INDUSTRY]: '',
};

const defaultSecondStepValues = {
  discount_type: 0,
  [SECONDSTEP.START_DATE]: null,
  [SECONDSTEP.END_DATE]: null,
  [SECONDSTEP.DESCRIPTION]: '',
  [SECONDSTEP.DISCOUNT_TYPE]: 0,
  [SECONDSTEP.ACTION_SIZE]: '',
  [SECONDSTEP.NAME]: '',
};

class Tinder {
    @observable isFloatSidebarOpened = false;
    @observable.ref floatSidebarContent = null;
    @observable addressSearch = '';
    @observable.ref addressesFounded = null;
    @observable.ref mapPoints = [];
    @observable.ref industryItems = [];
    @observable partnersListInput = '';
    @observable businessesListInput = '';
    @observable searchIsFetching = false;
    @observable industryLoading = false;
    @observable itemLoading = false;
    @observable.ref objectManager = null;
    @observable industryId = null;
    @observable.ref item = null;
    @observable stepsPassed = [];
    @observable isMapPointsLoaded = false;
    @observable sidebarScreen = SCREEN.PARTNERSHIP; // partnership; business; industry; item
    @observable.ref map = null;
    @observable firstStepValues = defaultFirstStepValues;
    @observable isInitialDataLoading = true;
    @observable secondStepValues = defaultSecondStepValues;
    @observable thirdStepValues = null;
    @observable showAddressError = false;
    @observable stepUploading = false;
    @observable introStep = 0;
    @observable isIntroFinished = false;
    @observable.ref minActionStartDate = null;
    @observable.ref minEndDate = null;
    @observable businessId = null;
    @observable actionIdFromPartner = null;
    @observable businessIdFromPartner = null;
    @observable myBusiness = [];
    @observable showModalAddBusiness = false;
    @observable isModalPartnersOpened = false;
    @observable partnersRequest = false;
    @observable partnersRequestFailed = null;
    @observable myBusinessActiveTab = MY_BUSINESS_TABS.ACTIVE_ACTIONS;
    @observable myBusinessActiveScreen = MY_BUSINESS_SCREEN.BUSINESSES_LIST;
    @observable activeBusinessId = null;
    @observable showModalAddAction = false;
    @observable currentPartnerViewId = null;
    @observable myPartners = [];
    @observable myPartnersLoading = false;
    @observable isLandingShowed = false;

    @action showFloatSidebar = () => {
      this.isFloatSidebarOpened = true;
    }

    @action openModalPartners = ({ businessId, actionId }) => {
      if (!businessId || !actionId) return;
      this.businessIdFromPartner = businessId;
      this.actionIdFromPartner = actionId;
      this.isModalPartnersOpened = true;
    }
    @computed get getActiveActionId() {
      if (this.actionIdFromPartner && this.isModalPartnersOpened) return this.actionIdFromPartner;
      return null;
    }

    @action goToBusiness = id => {
      if (!id) return;
      this.activeBusinessId = id;
      this.myBusinessActiveScreen = MY_BUSINESS_SCREEN.CONTROLS;
    }

    @action goBackToBusinessList = () => {
      this.activeBusinessId = null;
      this.myBusinessActiveScreen = MY_BUSINESS_SCREEN.BUSINESSES_LIST;
    }

    @action closeModalPartners = () => {
      this.businessIdFromPartner = null;
      this.actionIdFromPartner = null;
      this.isModalPartnersOpened = false;
      if (this.partnersRequestFailed === false) {
        if (this.isFloatSidebarOpened) {
          this.hideFloatSidebar();
        }
        this.sidebarScreen = SCREEN.PARTNERSHIP;
        this.myBusinessActiveScreen = MY_BUSINESS_SCREEN.BUSINESSES_LIST;
      }
      this.partnersRequestFailed = null;
    }

    @action hideFloatSidebar = () => {
      this.isFloatSidebarOpened = false;
      this.closeModalPartners();
    }

    @action set = (property, value) => {
      this[property] = value;
    }

    @action filterByIndustryId = (id) => {
      id === this.industryId ? this.industryId = null : this.industryId = id;
    }

    @action getMapPoints = async () => {
      if (!Common.industries.length) {
        await Common.getIndustries();
      }
      const data = await axiosAuthorizedRequest({ url: '/api/v1/client/businesses/points/' });
      runInAction(() => {
        this.mapPoints = data;
        this.isMapPointsLoaded = true;
      });
    }

    @action becomePartners = async ({ businessId, actionId }) => {
      try {
        this.partnersRequest = true;
        const data = {
          from_business: businessId,
          to_business: this.businessIdFromPartner,
          from_action: actionId,
          to_action: this.actionIdFromPartner,
        };
        await composeAxiosPostRequest({
          url: '/api/v1/client/partners/',
          data,
        });
        this.set('partnersRequestFailed', false);
      } catch (e) {
        this.set('partnersRequestFailed', true);
        console.log(e);
      } finally {
        this.set('partnersRequest', false);
      }
    }

    @action goToIndustry = async id => {
      try {
        this.sidebarScreen = SCREEN.INDUSTRY;
        if (id) {
          this.objectManager.setFilter(`properties.industry == ${id}`);
        }
        this.industryLoading = true;
      } catch (e) {
        console.log(e);
      }

      try {
        const data = await axiosAuthorizedRequest({
          url: id ? `/api/v1/client/businesses/?industry=${id}` : '/api/v1/client/businesses/',
        });
        runInAction(() => { this.industryItems = data; });
      } catch (e) {
        console.log(e);
      } finally {
        runInAction(() => { this.industryLoading = false; });
      }
    }

    @action getAddresses = async () => {
      try {
        const searchString = this.addressSearch.split(',').map(item => { return item.trim(); }).join('+');
        this.searchIsFetching = true;
        const { data } = await axios(
          `https://geocode-maps.yandex.ru/1.x/?apikey=43c8ca57-5e50-4d09-b675-6792bb128f49&lang=ru_RU&format=json&geocode=${searchString}`,
          {
            crossDomain: true,
          },
        );
        runInAction(() => {
          this.addressesFounded = data?.response?.GeoObjectCollection?.featureMember.map(item => {
            if (item.GeoObject.metaDataProperty.GeocoderMetaData.precision !== 'exact') {
              this.showAddressError = 'Введите точный адрес';
              return null;
            }
            this.showAddressError = false;
            this.addressSearch = item.GeoObject.metaDataProperty.GeocoderMetaData.text;
            return {
              label: item.GeoObject.metaDataProperty.GeocoderMetaData.text,
              value: item.GeoObject.Point.pos,
            };
          })[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.set('searchIsFetching', false);
      }
    }

    @computed get myBusinessesIdList() {
      return this.myBusiness.map(item => { return item.id; }) || [];
    }

    @computed get approvedBusinessList() {
      return this.myBusiness.filter(item => { return item.moderation_status === 1; }) || [];
    }

    @action getMyPartners = async () => {
      try {
        this.myPartnersLoading = true;
        const data = await axiosAuthorizedRequest({ url: '/api/v1/client/partners/' });
        this.myPartners = data.filter(item => {
          return item.from_business.id === this.activeBusinessId || item.to_business.id === this.activeBusinessId;
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.myPartnersLoading = false;
      }
    }

    @computed get getNewRequestsList() {
      // статус 0 - не принято решение
      return this.myPartners.filter(item => { return item.status === 0; });
    }

    @computed get actionsSortedbyStatus() {
      const rejected = [];
      const awaiting = [];
      const applied = [];
      this.myPartners.forEach(item => {
        if (item.status === 0) awaiting.push(item);
        if (item.status === 2) applied.push(item);
        if (item.status === 1) rejected.push(item);
      });
      return {
        rejected,
        awaiting,
        applied,
      };
    }

    @action goToPartnerView = partnerId => {
      this.currentPartnerViewId = partnerId;
      this.myBusinessActiveScreen = MY_BUSINESS_SCREEN.INCOMING_REQUEST;
    }

    @computed get getCurrentPartner() {
      return this.myPartners.find(item => { return item.id === this.currentPartnerViewId; }) || {};
    }

    @action goBackToRequests = () => {
      this.currentPartnerViewId = null;
      this.myBusinessActiveScreen = MY_BUSINESS_SCREEN.CONTROLS;
      this.myBusinessActiveTab = MY_BUSINESS_TABS.NEW_REQUESTS;
    }

    @action makeDecision = async decision => {
      try {
        const data = {
          accepted: decision,
        };
        await composeAxiosPostRequest({
          url: `/api/v1/client/partners/${this.getCurrentPartner.id}/partnership_decision/`,
          data,
        });
        this.goBackToRequests();
      } catch (e) {
        console.log(e);
      } finally {
        this.getAllMyBusinessesList();
        this.getMyPartners();
      }
    }

    @action submitCompanyInfo = async () => {
      try {
        this.stepUploading = true;
        await this.submitFirstStep();
        const data = {
          // если this.activeBusinessId нет, то человек перезагрузил страницу на этапе добавления акции
          // в этом случае просто берём id из первого бизнеса
          business_id: this.businessId || this.myBusiness[0].id,
          [SECONDSTEP.START_DATE]: moment(this.secondStepValues[SECONDSTEP.START_DATE]).format('YYYY-MM-DD'),
          [SECONDSTEP.END_DATE]: moment(this.secondStepValues[SECONDSTEP.END_DATE]).format('YYYY-MM-DD'),
          [SECONDSTEP.DESCRIPTION]: this.secondStepValues[SECONDSTEP.DESCRIPTION],
          [SECONDSTEP.DISCOUNT_TYPE]: this.secondStepValues[SECONDSTEP.DISCOUNT_TYPE],
          [SECONDSTEP.ACTION_SIZE]: this.secondStepValues[SECONDSTEP.ACTION_SIZE],
          [SECONDSTEP.NAME]: this.secondStepValues[SECONDSTEP.NAME],
        };
        await composeAxiosPostRequest({
          url: '/api/v1/client/actions/',
          data,
        });
        await this.getAllMyBusinessesList();
      } catch (e) {
        console.log(e);
      } finally {
        this.stepUploading = false;
      }
    }

    @action backToIndustry = id => {
      this.objectManager.setFilter(`properties.industry == ${id}`);
      this.sidebarScreen = SCREEN.INDUSTRY;
      this.closeModalPartners();
    }

    @action getMyBusinesses = async () => {
      let hasSomeActions = false;
      const response = await axiosAuthorizedRequest({ url: '/api/v1/client/businesses/my_business/' });

      if (response.length) {
        hasSomeActions = response.some(item => item.actions_count);
      }

      if (hasSomeActions) {
        runInAction(() => {
          this.isIntroFinished = true;
          this.myBusiness.push(...response);
        });
      } else if (response.length && !hasSomeActions) {
        this.set('introStep', 2);
        this.myBusiness.push(...response);
      } else {
        this.set('introStep', 0);
      }

      this.set('isInitialDataLoading', false);
    }

    @action getAllMyBusinessesList = async () => {
      // просто получаем весть список бизнесов и перезаписываем стор
      const response = await axiosAuthorizedRequest({ url: '/api/v1/client/businesses/my_business/' });
      this.myBusiness = response;
    }

    @action addAction = async () => {
      try {
        this.stepUploading = true;
        const data = {
          business_id: this.activeBusinessId,
          [SECONDSTEP.START_DATE]: moment(this.secondStepValues[SECONDSTEP.START_DATE]).format('YYYY-MM-DD'),
          [SECONDSTEP.END_DATE]: moment(this.secondStepValues[SECONDSTEP.END_DATE]).format('YYYY-MM-DD'),
          [SECONDSTEP.DESCRIPTION]: this.secondStepValues[SECONDSTEP.DESCRIPTION],
          [SECONDSTEP.DISCOUNT_TYPE]: this.secondStepValues[SECONDSTEP.DISCOUNT_TYPE],
          [SECONDSTEP.ACTION_SIZE]: this.secondStepValues[SECONDSTEP.ACTION_SIZE],
          [SECONDSTEP.NAME]: this.secondStepValues[SECONDSTEP.NAME],
        };
        const newAction = await composeAxiosPostRequest({
          url: '/api/v1/client/actions/',
          data,
        });
        runInAction(() => {
          const index = this.myBusiness.findIndex(item => { return item.id === this.activeBusinessId; });
          this.myBusiness[index].actions.push(newAction);
          this.showModalAddAction = false;
          this.secondStepValues = {
            discount_type: 0,
          };
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.stepUploading = false;
      }
    }

    @action addBusiness = async () => {
      if (!this.getAddressError()) return;
      try {
        this.stepUploading = true;
        const data = {
          [FIRSTSTEP.NAME]: this.firstStepValues[FIRSTSTEP.NAME],
          [FIRSTSTEP.PHONE]: this.firstStepValues[FIRSTSTEP.PHONE],
          [FIRSTSTEP.SITE]: this.firstStepValues[FIRSTSTEP.SITE],
          point: this.addressesFounded.value.split(' ').reverse().map(item => { return +item; }),
          address: this.addressesFounded.label,
          [FIRSTSTEP.DESCRIPTION]: this.firstStepValues[FIRSTSTEP.DESCRIPTION],
          [FIRSTSTEP.INDUSTRY]: this.firstStepValues[FIRSTSTEP.INDUSTRY],
        };

        await composeAxiosPostRequest({
          url: '/api/v1/client/businesses/',
          data,
        });
        await this.getAllMyBusinessesList();
        runInAction(() => {
          this.showModalAddBusiness = false;
          this.firstStepValues = defaultFirstStepValues;
          this.addressesFounded = null;
          this.addressSearch = '';
        });
      } catch (e) {
        console.log(e);
      } finally {
        runInAction(() => { this.stepUploading = false; });
      }
    }

    @action startWork = async () => {
      try {
        await this.submitCompanyInfo();
        this.firstStepValues = defaultFirstStepValues;
        this.secondStepValues = defaultSecondStepValues;
        this.isIntroFinished = true;
      } catch (e) {
        console.log(e);
      }
    }

    @action goToSecondStep = async () => {
      if (!this.getAddressError()) return;
      this.introStep = 2;
      this.stepsPassed.push(1);
    }

    @action goToThirdStep = async () => {
      this.introStep = 3;
      this.stepsPassed.push(2);
    }

    @action submitFirstStep = async () => {
      try {
        const data = {
          [FIRSTSTEP.NAME]: this.firstStepValues[FIRSTSTEP.NAME],
          [FIRSTSTEP.PHONE]: this.firstStepValues[FIRSTSTEP.PHONE],
          [FIRSTSTEP.SITE]: this.firstStepValues[FIRSTSTEP.SITE],
          point: this.addressesFounded.value.split(' ').reverse().map(item => { return +item; }),
          address: this.addressesFounded.label,
          [FIRSTSTEP.DESCRIPTION]: this.firstStepValues[FIRSTSTEP.DESCRIPTION],
          [FIRSTSTEP.INDUSTRY]: this.firstStepValues[FIRSTSTEP.INDUSTRY],
        };
        const createdBusiness = await composeAxiosPostRequest({
          url: '/api/v1/client/businesses/',
          data,
        });
        runInAction(() => {
          this.firstStepValues = defaultFirstStepValues;
          this.addressesFounded = null;
          this.addressSearch = '';
        });
        const response = await axiosAuthorizedRequest({ url: `/api/v1/client/businesses/${createdBusiness.id}` });
        runInAction(() => {
          this.myBusiness.push(response);
          this.businessId = createdBusiness.id;
        });
      } catch (e) {
        console.log(e);
      }
    }
    // eslint-disable-next-line
    @action getAddressError = () => {
      if (!this.addressesFounded?.value && !this.searchIsFetching) {
        this.showAddressError = 'Начните вводить адрес и выберите его из выпадающего списка';
        return false;
      }
      return true;
    }

    @action goToIndustriesList = () => {
      this.sidebarScreen = SCREEN.PARTNERSHIP;
      this.objectManager.setFilter('properties.industry');
      this.industryItems = [];
    }

    @action goToItem = async id => {
      this.sidebarScreen = SCREEN.ITEM;
      this.objectManager.setFilter(`id === ${id}`);
      this.map.panTo(this.objectManager.objects.getById(id).geometry.coordinates, { useMapMargin: true });
      try {
        this.itemLoading = true;
        const data = await axiosAuthorizedRequest({ url: `/api/v1/client/businesses/${id}/` });
        runInAction(() => { this.item = data; });
      } catch (e) {
        console.log(e);
      } finally {
        runInAction(() => { this.itemLoading = false; });
      }
    }

    @action openItemInFloatSidebar = async id => {
      this.isFloatSidebarOpened = true;
      this.map.panTo(this.objectManager.objects.getById(id).geometry.coordinates, { useMapMargin: true });
      try {
        this.itemLoading = true;
        const data = await axiosAuthorizedRequest({ url: `/api/v1/client/businesses/${id}/` });
        runInAction(() => { this.item = data; });
      } catch (e) {
        console.log(e);
      } finally {
        runInAction(() => { this.itemLoading = false; });
      }
    }

    @computed get getFilteredMapPoints() {
      if (this.industryId) return this.mapPoints.filter(item => { return item.id === this.industryId; });
      return this.mapPoints;
    }

    @computed get getCurrentBusiness() {
      return this.myBusiness.find(item => { return item.id === this.activeBusinessId; }) || {};
    }

    @computed get getIndustriesList() {
      if (this.partnersListInput) return Common.industries.filter(item => item.label.toLowerCase().includes(this.partnersListInput.toLowerCase()));
      return Common.industries;
    }

    @computed get getBusinessesList() {
      if (this.businessesListInput) return this.industryItems.filter(item => item.name.toLowerCase().includes(this.businessesListInput.toLowerCase()));
      return this.industryItems;
    }
}

const store = new Tinder();

export default store;
