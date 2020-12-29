import { pushClickLeftNavToGA } from 'components/layouts/SideMenu/ga/utils';
import { CHANGE_ACTIVE_QUESTION, SET_FAQ_DATA } from './constants';

export const changeFaqQuestion = ({ subSlugItem }) => ({
  type: CHANGE_ACTIVE_QUESTION,
  payload: subSlugItem && subSlugItem.slug,
});

export const changeFaqQuestionWithGA = ({ subSlugItem }) => (dispatch) => {
  pushClickLeftNavToGA({
    slugTitle: 'Помощь',
    subSlugTitle: subSlugItem ? subSlugItem.title : '',
  });
  dispatch(changeFaqQuestion({ subSlugItem }));
};

export const setFaqData = payload => ({ type: SET_FAQ_DATA, payload });
