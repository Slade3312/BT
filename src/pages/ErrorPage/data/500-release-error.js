import { ACTION_TYPE_RESET } from '../constants';

export default {
  emoji: 'statusFail',
  title: 'Что-то пошло не так :(',
  description: 'Попробуйте повторить позднее',
  infoButtonLink: {
    text: 'Обновить страницу',
    type: ACTION_TYPE_RESET,
  },
};
