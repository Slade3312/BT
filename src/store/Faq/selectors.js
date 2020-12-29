import { createSelector } from 'reselect';
import { convertListToObjectBy } from 'utils/fn';

const getFaqData = state => state.faq || {};

const getFaqDataList = state => getFaqData(state).list;

export const getActiveQuestionCategory = createSelector(
  getFaqData,
  getFaqDataList,
  (faqState, mainList) => faqState.activeQuestionCategory || mainList[0].category,
);

export const getSideMenuList = createSelector(
  getFaqDataList,
  getActiveQuestionCategory,
  (list, activeQuestionCategory) => [{
    title: 'Помощь',
    slug: 'user_profile',
    subItems: list.map(item => ({
      title: item.category,
      slug: item.category,
      isActive: activeQuestionCategory === item.category,
    })),
  }],
);

const getFaqListData = createSelector(
  getFaqDataList,
  convertListToObjectBy('category'),
);

const getActiveCategoryData = createSelector(
  getFaqListData,
  getActiveQuestionCategory,
  (listDataObj, activeCategory) => listDataObj[activeCategory],
);

export const getActiveCategoryFaqsList = state => getActiveCategoryData(state).faqs;
