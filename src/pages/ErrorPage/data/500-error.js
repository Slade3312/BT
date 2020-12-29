import { ACTION_TYPE_RELOAD } from '../constants';

export default {
  emoji: 'statusFail',
  title: 'Что-то пошло не так :(',
  description: 'Мы уже работаем над устранением ошибки, обновите страницу и попробуйте еще раз',
  infoButtonLink: {
    text: 'Обновить страницу',
    type: ACTION_TYPE_RELOAD,
  },
};
