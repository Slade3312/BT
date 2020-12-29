/**
 * A list.map for objects
 */
export const map = (obj, fn) =>
  Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key], key);
    return result;
  }, {});

/**
 * A list.filter for objects
 */
export const filter = (obj, fn) =>
  Object.keys(obj).reduce((result, key) => {
    if (fn(obj[key], key)) result[key] = obj[key];
    return result;
  }, {});

/**
 * A list.reduce for objects
 */
export const reduce = (obj, fn, initialState) =>
  Object.keys(obj)
    .reduce(
      (result, key) => fn(result, obj[key], key),
      initialState,
    );


export const filterDefined = obj => filter(obj, val => typeof val !== 'undefined');
export const filterValuable = obj => filter(obj, val => !isNullOrUndefined(val));

/*
  semantically correct filtering of formValues
  omit - remove when filtering
  passed - passed filter

  "" => omit
  {} => omit
  [] => omit
  null => omit
  undefined => omit
  NaN => omit
  true => passed
  false => passed
  {...} => passed
  [...] => passed
  other types of data => passed
 */
export const filterValuableFormFields = obj =>
  filter(obj, (val) => {
    if (!isNullOrUndefined(val)) {
      if (typeof val === 'boolean') return true;
      if (typeof val === 'object') {
        if (Array.isArray(val)) return val.length > 0;
        return Object.keys(val).length > 0;
      }
      if (typeof val === 'string') return val.length > 0;
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) return false;
      return true;
    }
    return false;
  });

export const flatten = arrayOfArrays => [].concat(...arrayOfArrays);
export const distinct = arrayWithDuplicates => Array.from(new Set(arrayWithDuplicates));
export const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Group a large array into an array of arrays by result of `fn` call on item
 * To avoid grouping elements, `NaN` can be returned (since NaN !== NaN)
 * @returns {[[item]]}
 */
export const sliceBy = (list, fn) => {
  if (!list.length) return [];
  const [first, ...rest] = list;
  const isSameGroup = item => fn(item) === fn(first);
  return [[first, ...rest.filter(isSameGroup)], ...sliceBy(rest.filter(item => !isSameGroup(item)), fn)];
};

export const convertListToObjectBy = field => list =>
  list.reduce((result, item) => {
    result[item[field]] = item;
    return result;
  }, {});

export const passAsIs = obj => obj;

export const isNullOrUndefined = value => value === null || typeof value === 'undefined';

export const explodeStringByRegExp = (string, matchRegExp) => {
  const matchResult = string.match(matchRegExp);
  if (matchResult) {
    const matchedVal = matchResult[0];
    const matchIndexStart = matchResult.index;
    const matchIndexEnd = matchResult.index + matchedVal.length;
    return [string.slice(0, matchIndexStart), matchedVal, string.slice(matchIndexEnd)];
  }
  return [string, null, ''];
};

/**
 * Outputs the proper word declensions by given count
 * @param count - count to determine appropriate case
 * @param titles - list of words in three cases: [nominative, genitive, multiplicative]
 */

export const wordFormByCount = (count, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[count % 100 > 4 && count % 100 < 20 ? 2 : cases[count % 10 < 5 ? count % 10 : 5]];
};

/**
 *
 * @param count - count to determine appropriate case
 * @param titles - list of words in two cases: [genitive, multiplicative]
 * @returns {*}
 */
export const wordGenitiveFormByCount = (count, titles) => wordFormByCount(count, [titles[0], titles[1], titles[1]]);

const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

/** common methods defined by other libraries that can be possibly reused */

export const escapeStringRegexp = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }
  return string.replace(matchOperatorsRegex, '\\$&');
};
export { compose } from 'redux';

export { shallowEqualObjects as shallowEqual } from 'shallow-equal';

export const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

export const getRandomInt = (min, max) => Math.round(getRandomArbitrary(min, max));

export const getMaxObjBy = (items, fn) => {
  let max = Number.MIN_SAFE_INTEGER;
  let resultItem;

  items.forEach((item) => {
    const curVal = parseInt(fn(item), 10);

    if (curVal > max) {
      max = curVal;
      resultItem = item;
    }
  });

  return resultItem;
};

export const sumBy = (items, fn) => items.reduce((acc, next) => acc + parseInt(fn(next), 10), 0);

export const findLongestStringBy = (data, fn) => {
  let maxLength = 0;
  data.forEach((elem) => {
    const label = fn(elem);
    if (label && label.length > maxLength) {
      maxLength = label.length;
    }
  });
  return maxLength;
};

export const getFileExtension = (fileName) => {
  const extIndex = fileName.lastIndexOf('.');
  return fileName.slice(extIndex + 1).toLowerCase();
};

export const convertMbToBytes = mbCount => mbCount * 1048576;

export const getRndRangeFloat = (min, max) => Math.random() * (max - min) + min;

export const getRndRange = (min, max) => Math.round(getRndRangeFloat(min, max));
