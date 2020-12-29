import moment from 'moment';
import { wordFormByCount } from 'utils/fn';

const weekDayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthsNames = [
  'января', 'февраля', 'марта', 'апреля',
  'мая', 'июня', 'июля', 'августа',
  'сентября', 'октября', 'ноября', 'декабря',
];

export const getWeekDayName = dayNumber => weekDayNames[dayNumber];
export const getMonthName = monthNumber => monthsNames[monthNumber];

export const addDays = (date, numDays) => {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

export const addMonths = (date, numMonths) => {
  const newDate = date.setMonth(date.getMonth() + numMonths);
  return new Date(newDate);
};

export const formatDateBySplitter = (dateStr = '', splitter = '-') => {
  const [year = '', month = '', day = ''] = dateStr.split(splitter);
  if (dateStr.split(splitter).length === 3) return `${day}.${month}.${year}`;

  console.warn('formatDateBySplitter: неверно задан требуемый формат даты');
  return '';
};

export function formatDate([start, end]) {
  const fd1 = start && start.format('YYYY-MM-DD').substring(0, 10);
  const fd2 = end && end.format('YYYY-MM-DD').substring(0, 10);

  return [fd1, fd2];
}

const contactsCases = ['контакт', 'контакта', 'контактов'];
export const contactsFormByCount = count => wordFormByCount(count, contactsCases);

const customersCases = ['абонент', 'абонента', 'абонентов'];
export const customersFormByCount = count => {
  return wordFormByCount(Math.floor(count), customersCases);
};

export const getFormattedDate = (dateString) => moment(dateString).format('YYYY.MM.DD');

export const getIsWorkTime = (holidays, startTime = '09:00') => {
  const date = moment();
  const dayNum = date.day();
  const currentDay = date.format('YYYY-MM-DD').substring(0, 10);
  const currentHour = parseInt(date.format('HH'), 10);
  const currentMinutes = parseInt(date.format('mm'), 10);

  const [startHoursString, startMinutesString] = startTime.split(':');
  const [startHours, startMinutes] = [parseInt(startHoursString, 10), parseInt(startMinutesString, 10)];

  if (holidays[currentDay] || dayNum === 0 || dayNum === 6) {
    return false;
  }

  if (startHours === currentHour && currentMinutes < startMinutes) {
    return false;
  }

  if (dayNum === 5) {
    if (currentHour < startHours || ((currentHour === 16 && currentMinutes > 45) || currentHour > 16)) {
      return false;
    }
  }

  if (currentHour < startHours || currentHour >= 18) {
    return false;
  }

  return true;
};
