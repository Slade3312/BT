import { observable, action, runInAction } from 'mobx';
import { TEMPLATES_URL } from 'requests/constants';
import {
  deepTemplateTransformByContentType,
  deepMergeWithArraysByIndex,
} from 'store/common/templates/utils';
import {
  axiosAuthorizedRequest,
  composeErrorCatchingRequest,
} from 'requests/helpers';
import { DEFAULT_TEMPLATES } from 'store/common/templates/__defaultData/indexMobx';
import {
  getAudienceStatisticTemplate,
  getDashboardTemplate,
  getPopupsTemplate,
  getPollsTemplate,
  getCommonTemplate,
  getWebinarSubscribe,
  getNewCampaignTemplate,
  getConfirmInnTemplate,
  getChatTemplate,
  getConfirmInnPrivateTemplate,
} from './Normalize';

class Templates {
  constructor() {
    this.getAudienceStatisticTemplate = getAudienceStatisticTemplate.bind(this);
    this.getNewCampaignTemplate = getNewCampaignTemplate.bind(this);
    this.getPopupsTemplate = getPopupsTemplate.bind(this);
    this.getPollsTemplate = getPollsTemplate.bind(this);
    this.getCommonTemplate = getCommonTemplate.bind(this);
    this.getWebinarSubscribe = getWebinarSubscribe.bind(this);
    this.getDashboardTemplate = getDashboardTemplate.bind(this);
    this.getConfirmInnTemplate = getConfirmInnTemplate.bind(this);
    this.getConfirmInnPrivateTemplate = getConfirmInnPrivateTemplate.bind(this);
    this.getChatTemplate = getChatTemplate.bind(this);
  }

  @observable.ref data = {
    common: null,
    dashboard: null,
    userInfo: null,
    faq: null,
    newCampaign: null,
    myCampaigns: null,
    audienceStatistic: null,
    notifications: null,
    popups: null,
    polls: null,
  };

  @action getTemplate = composeErrorCatchingRequest(async (templateName) => {
    if (this.data[templateName]) {
      return;
    }

    const response = await axiosAuthorizedRequest({
      url: TEMPLATES_URL,
      params: { name: templateName },
    });

    runInAction(() => {
      this.data[templateName] = deepTemplateTransformByContentType(deepMergeWithArraysByIndex(DEFAULT_TEMPLATES[templateName], response));
    });
  });
}

const templatesStore = new Templates();
export default templatesStore;
