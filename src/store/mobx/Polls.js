import { action, observable, reaction, runInAction, computed } from 'mobx';
import { axiosAuthorizedRequest, composeAxiosDeleteRequest } from 'requests/helpers';
import { CAMPAIGN_API_URL, CAMPAIGN_SORT_PARAMS } from 'requests/campaigns/constants';
import { FIELD_CAMPAIGN_NAME, FIELD_STATUS } from 'store/shared/campaign-and-orders/constants';
import { POLLS_TARIFFS, POLLS_CREATE } from 'requests/constants';
import { debounce } from 'utils/debounce';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import { CHANNEL_STUB_POLL } from 'constants/index';
import checkForInn from 'store/mobx/requests/checkForInn';
import { calcPriceByDiscount } from 'utils/business';
import Common from './Common';

const CHANNEL_TYPE = 5;
const ITEMS_IN_REQUEST = 5;

export const FORM_FIELDS = {
  QUESTION: 'comment',
  GEOGRAPHY: 'geography',
  PROFILE: 'profile',
  BUDGET: 'budget',
  PROMOCODE: 'promo_code',
};

class Polls {
  @observable modal = {
    isLoading: false,
    isModalOpened: false,
    isSuccessModalOpened: false,
    isFailModalOpened: false,
    tariff_uid: undefined,
    promoCodeValue: '',
    promoCodeModalFailed: false,
    shouldValidatePromo: false,
    promoTypeId: '',
    fields: {
      [FORM_FIELDS.QUESTION]: '',
      [FORM_FIELDS.GEOGRAPHY]: '',
      [FORM_FIELDS.PROFILE]: '',
      [FORM_FIELDS.BUDGET]: '',
      [FORM_FIELDS.PROMOCODE]: '',
    },
  };

  @observable tariffs = [];
  @observable pollsListLoading = false;
  @observable.shallow pollsList = [];
  @observable totalCount = 0;
  @observable totalCountByChannelType = 0;
  @observable count = 0;
  @observable nextPageLink = null;

  @action set = (property, value) => {
    this[property] = value;
  };

  @action setModal = (property, value) => {
    this.modal[property] = value;
  };

  @action setModalFields = (value) => {
    this.modal.fields = value;
  };

  @action erasePromoCode = () => {
    this.modal.fields[FORM_FIELDS.PROMOCODE] = '';
    this.modal.promoTypeId = '';
    this.modal.promoCodeValue = '';
  }

  @computed get nextCount() {
    const listSize = this.pollsList.length;
    const remainingItems = this.count - listSize;

    if (remainingItems < ITEMS_IN_REQUEST && remainingItems > 0) return remainingItems;
    if (remainingItems <= 0) return 0;

    return ITEMS_IN_REQUEST;
  }

  @action handleSendPoll = async () => {
    const isFilledInn = await checkForInn(
      () => { this.modal.isModalOpened = false; },
      () => { this.modal.isModalOpened = true; },
    );
    if (!isFilledInn) return;
    this.sendPoll();
  }

  @action resetModalData = () => {
    this.modal.isLoading = false;
    this.modal.isModalOpened = false;
    this.modal.isSuccessModalOpened = false;
    this.modal.isFailModalOpened = false;
    this.modal.tariff_uid = undefined;
    this.modal.promoCodeValue = '';
    this.modal.promoCodeModalFailed = false;
    this.modal.fields = {
      [FORM_FIELDS.QUESTION]: '',
      [FORM_FIELDS.GEOGRAPHY]: '',
      [FORM_FIELDS.PROFILE]: '',
      [FORM_FIELDS.BUDGET]: '',
      [FORM_FIELDS.PROMOCODE]: '',
    };
  }

  @action setPromocode = value => {
    this.modal.promoCodeModalFailed = false;
    this.modal.shouldValidatePromo = true;
    this.modal.fields[FORM_FIELDS.PROMOCODE] = value.toUpperCase();
  }

  @computed get promocodeError() {
    if (!this.modal?.fields[FORM_FIELDS.PROMOCODE]) return false;
    if (!this.modal.fields[FORM_FIELDS.PROMOCODE].length) {
      return 'Поле не может быть пустым';
    }
    if (this.modal.promoCodeModalFailed) return 'Данный промокод не существует или срок действия истёк';
    return false;
  }

  @computed get promocodeSuggest() {
    return this.modal.fields[FORM_FIELDS.PROMOCODE] && !this.modal.promoCodeValue && 'Нажмите "Применить" для проверки промокода' || false;
  }

  @action checkPollsPromocode = async () => {
    if (this.promocodeError) return;
    if (!this.modal.fields[FORM_FIELDS.BUDGET] || parseFloat(this.modal.fields[FORM_FIELDS.BUDGET]) < Common?.constants?.MIN_POLL_BUDGET) {
      // спасибо "отличной" final form за то, что заставляет писать меня такой треш
      document.getElementsByName(FORM_FIELDS.BUDGET)[0].focus();
      document.getElementsByName(FORM_FIELDS.BUDGET)[0].blur();
      return;
    }
    try {
      this.modal.promoCodeModalFailed = false;
      const response = await axiosAuthorizedRequest({
        url: '/api/v1/client/campaigns/check_common_promo_code/',
        method: 'POST',
        data: {
          promo_code: this.modal.fields[FORM_FIELDS.PROMOCODE],
        },
      });
      runInAction(() => {
        this.modal.promoCodeValue = response.promo_code_value;
        this.modal.promoTypeId = response.promo_code_value_type_id;
      });
    } catch (e) {
      runInAction(() => { this.modal.promoCodeModalFailed = true; });
    }
  }

  @computed get getPromoPrice() {
    return calcPriceByDiscount(
      this.modal.fields[FORM_FIELDS.BUDGET],
      this.modal.promoTypeId,
      this.modal.promoCodeValue,
    );
  }

  @action getNextPollsList = async () => {
    this.pollsListLoading = true;

    if (this.nextPageLink) {
      const list = await axiosAuthorizedRequest({
        url: this.nextPageLink,
      });

      runInAction(() => {
        this.pollsList.push(...list.results);
        this.pollsListLoading = false;
        this.count = list.count;
        this.nextPageLink = list.next;
      });
    }
  };

  getTotalCountByChannelType = async () => {
    const pollsResult = await axiosAuthorizedRequest({
      url: CAMPAIGN_API_URL,
      params: {
        limit: 1,
        channel_type: CHANNEL_TYPE,
      },
    });
    runInAction(() => {
      this.totalCountByChannelType = pollsResult.count;
    });
  };

  @action getPollsList = async () => {
    this.pollsListLoading = true;

    const pollsList = await axiosAuthorizedRequest({
      url: CAMPAIGN_API_URL,
      params: {
        limit: ITEMS_IN_REQUEST,
        channel_type: CHANNEL_TYPE,
        sort: CAMPAIGN_SORT_PARAMS.CREATE_DATE_DESC,
        campaign_name: this.values[FIELD_CAMPAIGN_NAME] || undefined,
        order_status: this.values[FIELD_STATUS] || undefined,
      },
    });

    runInAction(() => {
      this.pollsList = pollsList.results;
      this.pollsListLoading = false;
      this.count = pollsList.count;
      this.nextPageLink = pollsList.next;
      this.totalCount = pollsList.count;
    });
  };

  @observable.ref values = {
    status: 0,
    campaign_name: '',
  };

  @action removePollById = async (pollId) => {
    this.pollsListLoading = true;
    await composeAxiosDeleteRequest({ url: `${CAMPAIGN_API_URL}${pollId}` })();
    runInAction(() => {
      this.pollsList = this.pollsList.filter(item => item.id !== pollId);
      this.pollsListLoading = false;
    });
    return Promise.resolve();
  };

  @action getTariffs = async () => {
    if (this.tariffs.length > 0) {
      return;
    }

    this.tariffs = await axiosAuthorizedRequest({ url: POLLS_TARIFFS });
  };

  @action showIsSuccessModal = (isSuccess) => {
    this.modal.isModalOpened = false;

    if (isSuccess) {
      this.modal.isSuccessModalOpened = true;
    } else {
      this.modal.isFailModalOpened = true;
    }
  };

  @action sendPoll = async () => {
    this.modal.isLoading = true;

    try {
      const { id, orders } = await axiosAuthorizedRequest({ method: 'POST',
        url: POLLS_CREATE,
        data: {
          tariff_uid: this.modal.tariff_uid,
          ...this.modal.fields,
        },
      });
      const pollOrder = orders.find(item => item.channel_uid === CHANNEL_STUB_POLL);

      this.showIsSuccessModal(true);

      pushToGA({
        event: 'event_b2b_quiz_order',
        action: 'order_success',
        b2b_campaign_id: id,
        b2b_order_id: pollOrder?.id,
      });
    } catch (e) {
      this.showIsSuccessModal(false);
      pushToGA({
        event: 'event_b2b_quiz',
        action: 'order_error',
      });
    } finally {
      runInAction(() => {
        this.modal.isLoading = false;
      });
    }
  };

  @action setIsOpened = async (val) => {
    this.modal.isModalOpened = val;
  }
}
const polls = new Polls();
const updatePolls = debounce(() => polls.getPollsList(), 500);
const updateTotalCountByChannelType = debounce(() => polls.getTotalCountByChannelType(), 500);

reaction(
  () => polls.values,
  () => {
    updatePolls();
    updateTotalCountByChannelType();
  },
);

reaction(
  () => polls.modal.isModalOpened,
  () => {
    if (polls.modal.isModalOpened) {
      pushToGA({ event: 'event_b2b_quiz', action: 'show_popup' });
    }
  },
);

reaction(
  () => parseFloat(polls.modal.fields[FORM_FIELDS.BUDGET]) < Common?.constants?.MIN_POLL_BUDGET,
  () => { polls.modal.promoCodeValue = ''; },
);


export default polls;
