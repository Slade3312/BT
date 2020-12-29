import { CHANGE_ACTIVE_QUESTION, SET_FAQ_DATA } from './constants';

const initialState = {
  activeQuestionCategory: '',
  list: [{ category: '', faqs: [] }],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_ACTIVE_QUESTION: {
      return {
        ...state,
        activeQuestionCategory: action.payload,
      };
    }
    case SET_FAQ_DATA: {
      return {
        ...state,
        list: action.payload,
      };
    }
    default:
      return state;
  }
}
