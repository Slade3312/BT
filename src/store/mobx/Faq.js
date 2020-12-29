import { observable, action, runInAction, computed, reaction } from 'mobx';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { FAQ_CATEGORIES } from 'requests/faq/constants';
import { getStepNameGA } from 'utils/ga-analytics/utils';
import { pushToGA } from 'utils/ga-analytics/data-layer';

class Faq {
    @observable categories = [];
    @observable currentCategoryId = null;
    @action getCategories = async () => {
      const categories = await axiosAuthorizedRequest({ url: FAQ_CATEGORIES });
      runInAction(() => {
        this.categories = categories.map((item) => {
          return {
            ...item,
            faqs: item.faqs.map((question) => {
              return {
                ...question,
                id: String(question.id),
              };
            }),
            url: String(item.url) };
        });
      });
    }

    @action set = (property, value) => {
      this[property] = value;
    }

    @computed get isLoaded() {
      return !!this.categories.length;
    }

    @computed get sideMenu() {
      return this.categories;
    }

    @computed get currentCategoryFaq() {
      return this.categories.filter(category => category.url === this.currentCategoryId)[0] || {};
    }

    @computed get getUrlIdsList() {
      return this.categories.map(category => category.url);
    }

    @computed get sideMenuList() {
      return [{
        title: 'Помощь',
        slug: 'user_profile',
        subItems: this.categories.map(item => ({
          title: item.category,
          slug: item.category,
          href: item.url,
          isActive: item.url === this.currentCategoryId,
        })),
      }];
    }
}

const faqStore = new Faq();
reaction(
  () => (faqStore.currentCategoryId && !!faqStore.currentCategoryId),
  () => pushToGA({
    event: 'event_b2b',
    eventCategory: 'LeftNav',
    eventAction: getStepNameGA({
      slugTitle: 'Помощь',
      subSlugTitle: faqStore.currentCategoryFaq.category,
    }),
    eventLabel: window.location.pathname,
  }),
);
export default faqStore;
