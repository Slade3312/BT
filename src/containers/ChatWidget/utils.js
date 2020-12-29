import moment from 'moment';

export const getFormattedChatTime = (dateString) => {
  return moment(new Date(dateString)).format('HH:mm');
};
