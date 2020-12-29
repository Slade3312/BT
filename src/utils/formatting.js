/**
 * ouputs the proper word declensions by given count
 * @param count - count to determine appropriate case
 * @param titles - list of words in three cases: [nominative, genitive, multiplicative]
 * @returns {*}
 */
import { isNullOrUndefined } from 'utils/fn';

export const phoneProxyRegExp = /(\D)+/g;
export const phonePrefix = '+7';

/**
 * splits price value into three-digit groups
 * */
export function formatPrice(price) {
  if (isNullOrUndefined(price)) return '';
  const strPrice = typeof price === 'string' ? price : `${price}`;
  return strPrice.split('.')[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ') || '';
}

export const formatPriceWithLabel = (value, label) => `${formatPrice(value)} ${label || '₽'}`;

export const formatFloatWithComma = value => String(value).replace('.', ',');

const phonePattern = 'X|XXX|XXX|XX|XX';

export function formatPhone(phone) {
  if (phone[0] === '+') phone = phone.slice(1);

  let result = '';
  let checkedDelimiters = 0;
  for (let i = 0; i < phonePattern.length; i += 1) {
    if (isNullOrUndefined(phone[i - checkedDelimiters])) return result;
    if (phonePattern[i] === 'X') {
      result += phone[i - checkedDelimiters];
    } else {
      checkedDelimiters += 1;
      result += ' ';
    }
  }
  return result;
}

export function formatTenNumbersPhone(phone) {
  const phoneArr = phone.toString().split('');
  phoneArr.splice(3, 0, ' ');
  phoneArr.splice(7, 0, ' ');
  phoneArr.splice(10, 0, ' ');

  return phoneArr.join('');
}

export function formatPhoneRu(value) {
  const ruNumber = `7${value}`;
  return `+${formatPhone(ruNumber)}`;
}

export const formatPhoneProxy = (phoneVal) => {
  if (phoneVal) {
    const withoutPrefix = phoneVal.startsWith('+7') ? phoneVal.slice(2) : phoneVal;
    return withoutPrefix.replace(phoneProxyRegExp, '');
  }
  return '';
};
export const normalizePhone = phoneVal => `${phonePrefix}${phoneVal}`;

export const formatPureFileName = (fileName) => {
  const lastSlash = fileName.lastIndexOf('/');
  const lastPoint = fileName.lastIndexOf('.');
  return decodeURI(fileName.slice(lastSlash ? lastSlash + 1 : 0, lastPoint));
};
