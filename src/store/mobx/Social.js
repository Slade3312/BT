import { reaction, observable, action, computed, runInAction } from 'mobx';
import dataURItoBlob from 'utils/dataURItoBlob';
import bytesToSize from 'utils/bytesToSize';
import { ORDER_FILES_URL } from 'requests/client/constants';
import { MAX_CHARS_TITLE, MAX_CHARS_DESCRIPTION, ADCREATINGFORM } from 'pages/NewCampaign/constants';
import { requestIndustries } from 'requests/myTarget';
import { convertListToObjectBy } from 'utils/fn';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { deleteOrderFile } from 'requests/client/upload-order-file.js';
import { FILE_TYPES } from 'pages/constants';
import {
  ORDER_DATE,
  ORDER_ID,
  ORDER_IS_ACTIVE,
} from 'store/NewCampaign/channels/constants';
import NewCampaign from './NewCampaign';

export const initialAdStepValues = {
  [ORDER_IS_ACTIVE]: false,
  [ORDER_ID]: null,
  [ORDER_DATE]: [null, null],
  [ADCREATINGFORM.TITLE]: '',
  [ADCREATINGFORM.DESCRIPTION]: '',
  [ADCREATINGFORM.BUTTONTEXT]: '',
  [ADCREATINGFORM.WEBSITE]: '',
  [ADCREATINGFORM.UTM]: false,
  [ADCREATINGFORM.MOBILE]: true,
  [ADCREATINGFORM.DESKTOP]: true,
  [ADCREATINGFORM.AUTO_START]: true,
  [ADCREATINGFORM.CHOSEN_TARIFF]: null,
  [ADCREATINGFORM.CLIENT_INFO]: '',
  [ADCREATINGFORM.INDUSTRY]: null,
  [ADCREATINGFORM.INDUSTRY_DOCS]: [],
  [ADCREATINGFORM.FILES]: [],
  isEmpty: true,
};

class Social {
  @observable.shallow industries = [];
  @observable loadingIndustries = false;
  @observable loadIndustriesError = '';

  @observable adStep = { ...initialAdStepValues };
  @observable.ref tariffs = [];
  @observable.ref isTariffsLoading = false;
  @observable.ref buttonsList = [];
  @observable showErrors = false;

  @observable.ref logo = null;
  @observable.ref mainImg = null;
  @observable.ref postImg = null;
  @observable.ref logoImg = null;
  @observable.ref logoLink = null;
  @observable.ref mainImgLink = null;

  @action set = (field, value) => {
    this[field] = value;
  };
  @action setCompanyInfoFile = (fileObj) => {
    this.industries = this.industries.map(item => ({
      ...item,
      industry_docs: item.industry_docs.map(nestedItem => {
        if (fileObj.industry_docs === nestedItem.id) {
          return ({
            ...nestedItem,
            files: [...nestedItem.files, fileObj],
          });
        } return nestedItem;
      }),
    }));

    this.adStep[ADCREATINGFORM.INDUSTRY_DOCS] = this.activeCompanyIndustry.industry_docs.reduce((curSum, curEl) => {
      curSum = [...curSum, ...curEl.files];
      return curSum;
    }, []);
  };

  @action removeCompanyInfoFile = (fileId) => {
    const fileIndex = this.adStep[ADCREATINGFORM.INDUSTRY_DOCS].findIndex((fileItem) => fileItem.id === fileId);
    this.adStep[ADCREATINGFORM.INDUSTRY_DOCS].splice(fileIndex, 1);

    this.industries = this.industries.map(item => ({
      ...item,
      industry_docs: item.industry_docs.map(nestedItem => {
        return ({
          ...nestedItem,
          files: nestedItem.files.filter(filteredItem => !!filteredItem && filteredItem.id !== fileId),
        });
      }),
    }));
  };
  @action setCompanyInfoFilesFromDraft = () => {
    const ordersData = convertListToObjectBy('industry_docs')(this.adStep[ADCREATINGFORM.INDUSTRY_DOCS]);

    this.industries = this.industries.map(item => ({
      ...item,
      industry_docs: item.industry_docs.map(nestedItem => ({
        ...nestedItem,
        files: [...nestedItem.files, ordersData[nestedItem.id]],
      })),
    }));
  };
  @action removeMainImgData = () => {
    this.mainImg = null;
    this.teaserImg = null;
    this.postImg = null;
    URL.revokeObjectURL(this.mainImgLink);
    this.mainImgLink = null;
  };

  @action removeLogoImgData = () => {
    this.logo = null;
    this.logoImg = null;
    URL.revokeObjectURL(this.logoLink);
    this.logoLink = null;
  };

  getButtons = async () => {
    if (this.buttonsList.length) return;
    const options = await axiosAuthorizedRequest({
      url: '/api/v1/my_target/buttons/',
    });
    runInAction(() => {
      this.buttonsList = options.map(item => { return { label: item.name, value: item.id }; });
      if (!this.adStep[ADCREATINGFORM.BUTTONTEXT]) {
        this.adStep[ADCREATINGFORM.BUTTONTEXT] = this.buttonsList[0].value;
      }
    });
  }

  uploadLogo = async () => {
    const formData = new FormData();
    formData.append('file', dataURItoBlob(this.logoImg), this.logo.name);
    formData.append('type', FILE_TYPES.BRAND_FILE);
    formData.append('is_logo', true);
    const dataFile = await axiosAuthorizedRequest({
      url: ORDER_FILES_URL,
      method: 'POST',
      data: formData,
    });
    runInAction(() => {
      this.adStep[ADCREATINGFORM.FILES].push(dataFile);
    });
  }

  deleteLogo = async () => {
    await deleteOrderFile({ fileID: this.getLogo.id, orderId: NewCampaign.getCampaignTargetInternetOrder.id });
    runInAction(() => {
      this.adStep[ADCREATINGFORM.FILES].remove(this.getLogo);
    });
    this.removeLogoImgData();
  }

  deleteMainImg = async () => {
    await deleteOrderFile({ fileID: this.getPostImg.id, orderId: NewCampaign.getCampaignTargetInternetOrder.id });
    await deleteOrderFile({ fileID: this.getTeaserImg.id, orderId: NewCampaign.getCampaignTargetInternetOrder.id });
    runInAction(() => {
      this.adStep[ADCREATINGFORM.FILES].remove(this.getTeaserImg);
      this.adStep[ADCREATINGFORM.FILES].remove(this.getPostImg);
    });
    this.removeMainImgData();
  }

  uploadPostImg = async () => {
    const formData = new FormData();
    const squareFormData = new FormData();
    formData.append('file', dataURItoBlob(this.postImg), this.mainImg.name);
    formData.append('type', FILE_TYPES.BRAND_FILE);

    squareFormData.append('file', dataURItoBlob(this.teaserImg), this.mainImg.name);
    squareFormData.append('type', FILE_TYPES.BRAND_FILE);
    squareFormData.append('is_square', true);

    const teaser = await axiosAuthorizedRequest({
      url: ORDER_FILES_URL,
      method: 'POST',
      data: squareFormData,
    });

    const post = await axiosAuthorizedRequest({
      url: ORDER_FILES_URL,
      method: 'POST',
      data: formData,
    });
    runInAction(() => {
      this.adStep[ADCREATINGFORM.FILES].push(post);
      this.adStep[ADCREATINGFORM.FILES].push(teaser);
    });
  }

  @action fetchTariffs = async () => {
    if (!this.tariffs.length) {
      try {
        this.isTariffsLoading = true;
        const tariffs = await axiosAuthorizedRequest({
          url: '/api/v1/my_target/tariffs/',
        });
        runInAction(() => {
          this.tariffs = tariffs;
        });
        return tariffs;
      } finally {
        runInAction(() => {
          this.isTariffsLoading = false;
        });
      }
    }
    return this.tariffs;
  };

  @action setTariff = (id, { count }) => {
    this.tariffs = this.tariffs.map(tariff => {
      if (tariff.id === id) {
        return ({ ...tariff, count });
      } return tariff;
    });
  };

  @action getTariffDurationById = id => +this.tariffs.find(item => item.id === id).period;

  @action resetInternetTargetData = () => {
    this.tariffs = [];
    this.adStep = { ...initialAdStepValues };
    this.industries = [];
    this.removeMainImgData();
    this.removeLogoImgData();
  };

  @computed get getLogo() {
    return this.adStep?.files?.filter(item => item.is_logo)[0] || null;
  }

  @computed get getPostImg() {
    return this.adStep?.files?.filter(item => !item.is_logo && !item.is_square)[0] || null;
  }

  @computed get getTeaserImg() {
    return this.adStep?.files?.filter(item => item.is_square)[0] || null;
  }

  @computed get getSelectedTariff() {
    const selectedId = this.adStep[ADCREATINGFORM.CHOSEN_TARIFF];
    return this.tariffs.find(elem => elem.id === selectedId);
  }

  @computed get getTotalEvents() {
    return this.getSelectedTariff?.count || 0;
  }
  @computed get getTotalBudget() {
    return this.getSelectedTariff?.budget || 0;
  }

  @computed get getTariffsOptions() {
    return this.tariffs.map(({ id, ...other }) => ({ value: id, ...other }));
  }

  @computed get getChoosenTariffDuration() {
    return +this.tariffs.find(item => item.id === this.adStep?.chosenTariff).period;
  }

  @computed get getMainImg() {
    if (this.mainImg && this.mainImgLink) {
      URL.revokeObjectURL(this.mainImgLink);
      this.mainImgLink = URL.createObjectURL(this.mainImg);
    } else if (this.mainImg && !this.mainImgLink) {
      this.mainImgLink = URL.createObjectURL(this.mainImg);
    }
    return this.mainImgLink;
  }

  @computed get minimalAudience() {
    if (!this.tariffs.length) return 0;
    return this.tariffs.reduce((res, obj) => {
      return (obj.min_audience < res.min_audience) ? obj : res;
    }).min_audience;
  }

  @computed get mainImageSize() {
    return this.mainImg ? bytesToSize(this.mainImg.size) : null;
  }

  @computed get mainImageExt() {
    return this.mainImg ? this.mainImg.type.split('/')[1].toUpperCase() : null;
  }

  @computed get getLogoImg() {
    return this.adStep?.getLogo?.file || null;
  }

  @computed get getLogoForEdit() {
    if (this.logo && this.logoLink) {
      URL.revokeObjectURL(this.logoLink);
      this.logoLink = URL.createObjectURL(this.logo);
    } else if (this.logo && !this.logoLink) {
      this.logoLink = URL.createObjectURL(this.logo);
    }
    return this.logoLink;
  }

  @computed get getLogoSize() {
    return this.logo ? bytesToSize(this.logo.size) : null;
  }

  @computed get getLogoExt() {
    return this.logo ? this.logo.type.split('/')[1].toUpperCase() : null;
  }

  @computed get getAdTitle() {
    return this.adStep[ADCREATINGFORM.TITLE] || 'Введите заголовок объявления';
  }

  @computed get getAdDescription() {
    return (
      this.adStep[ADCREATINGFORM.DESCRIPTION] ||
      'Введите текст объявления длиной до 90 символов'
    );
  }

  @computed get getButtonText() {
    return (
      (this.adStep[ADCREATINGFORM.BUTTONTEXT] &&
        this.buttonsList.filter((item) => item.value === this.adStep[ADCREATINGFORM.BUTTONTEXT])[0]?.label) ||
      'Выберите действие'
    );
  }

  @computed get getTitleCharsNumber() {
    return this.adStep[ADCREATINGFORM.TITLE].length
      ? MAX_CHARS_TITLE - this.adStep[ADCREATINGFORM.TITLE].length
      : MAX_CHARS_TITLE;
  }

  @computed get getDescriptionCharsNumber() {
    return this.adStep[ADCREATINGFORM.DESCRIPTION].length
      ? MAX_CHARS_DESCRIPTION - this.adStep[ADCREATINGFORM.DESCRIPTION].length
      : MAX_CHARS_DESCRIPTION;
  }

  @action loadIndustries = async () => {
    if (!this.industries.length) {
      this.loadingIndustries = true;

      try {
        const newIndustries = await requestIndustries();
        this.industries = newIndustries;

        this.setCompanyInfoFilesFromDraft();
      } catch (error) {
        runInAction(() => {
          this.loadIndustriesError = error;
        });
      } finally {
        runInAction(() => {
          this.loadingIndustries = false;
        });
      }
    }
  };

  @computed get activeCompanyIndustryName() {
    return this.industries
      .find(item => item.id === this.adStep.industry)?.name || '';
  }

  @computed get activeCompanyIndustry() {
    const activeIndustry = this.industries
      .find(item => item.id === this.adStep.industry) || {};

    if (activeIndustry.id) {
      activeIndustry.industry_docs = activeIndustry.industry_docs.map(nestedItem => ({
        ...nestedItem,
        files: nestedItem.files ? nestedItem.files.filter(filteredItem => !!filteredItem) : [],
      }));
    }

    return activeIndustry;
  }


  @computed get industriesOptions() {
    return this.industries.map(item => ({ label: item.name, value: item.id }));
  }

  @computed get filesFields() {
    const completeData = convertListToObjectBy('id')(this.industries);
    return completeData[this.adStep.industry]?.industry_docs || [];
  }
}

const store = new Social();

reaction(() => {
  return store.adStep[ADCREATINGFORM.INDUSTRY];
}, () => {
  if (store.activeCompanyIndustry.id && store.activeCompanyIndustry.industry_docs.length === 0) {
    store.adStep[ADCREATINGFORM.INDUSTRY_DOCS] = [];
  }
  if (store.activeCompanyIndustry.id && store.activeCompanyIndustry.industry_docs.some(item => item?.files?.length)) {
    store.adStep[ADCREATINGFORM.INDUSTRY_DOCS] = store.activeCompanyIndustry.industry_docs
      .reduce((curSum, curEl) => {
        curSum = [...curSum, ...curEl.files?.filter(filteredItem => !!filteredItem)];
        return curSum;
      }, []);
  }
});

export default store;
