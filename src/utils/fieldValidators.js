import { ARRAY_ERROR } from 'final-form';
import moment from 'moment';
import { passAsIs } from './fn';

// eslint-disable-next-line no-useless-escape,max-len
export const urlRegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zа-яё0-9]+([\-\.]{1}[a-zа-яё0-9]+)*\.[a-za-ё]{2,}(:[0-9]{1,})?(\/.*)?$/i;

const urlGooglePlayRegExp = new RegExp('^(https?:\\/\\/)?play.google.com(\\/.*)?$');
const urlAppStoreRegExp = new RegExp('^(https?:\\/\\/)?apps.apple.com(\\/.*)?$');

/**
 * Function used to inject validators into form controlled by redux-forms
 * @param getValidators {function} - a function returning dict of field to validators
 * @returns {function(values)} - takes values and returns large object with errors for every separate validator
 *
 * Iterate fields that have validators and each validator individually
 * gather field errors in a large object and return it
 */
export const composeFormValidator = getValidators =>
  (values) => {
    values = values || {};
    const validators = getValidators();

    return Object.keys(validators).reduce((errors, name) => {
      let fieldValidatorsList = validators[name] || [];

      if (typeof validators[name] === 'function') {
        fieldValidatorsList = [fieldValidatorsList];
      }

      fieldValidatorsList.some((fieldValidator) => {
        const fieldError = fieldValidator(values[name], values);

        if (fieldError) {
          errors[name] = fieldError;
          return true;
        }
        return false;
      });

      return errors;
    }, {});
  };

const checkIsStringError = (val, message) => (
  val && ( // value should not be empty
    typeof val !== 'string' || // also it should either be not string
    val.replace(/^\s*(.*?)\s*$/, '$1').length // or not just spaces
  ) ? undefined : message
);

export const composeRequiredValidator = (message, valueGetter = passAsIs) => (value) => {
  const val = valueGetter(value);

  return checkIsStringError(val, message);
};

export const composePromoValidator = (promoCodeValue) => (value) => {
  if (promoCodeValue) return undefined;
  if (value !== '') return 'stub_string';
  return undefined;
};

export const composeCreativesValidator = () => (value) => {
  if (value.length !== 3) return `${value.length}`;
  return undefined;
};

export const composeSignAfterDotValidator = (message, maxSigns) => (value) => {
  if (typeof value === 'string' && value.split('.').length && value.split('.')[1] && value.split('.')[1].length - 1 >= maxSigns) return message;
  return undefined;
};

export const composeDateRequiredValidator = messages => (value) => {
  if (!value) {
    return messages[0];
  }
  const isError1 = checkIsStringError(value[0], messages[0]);
  const isError2 = checkIsStringError(value[1], messages[1]);

  return isError1 || isError2;
};

export const composeStartDateValidator = (message, minStart) => (value) => {
  if (value[0] && moment(value[0])?.isBefore(moment(minStart).startOf('day'))) {
    return message;
  }
  return undefined;
};

export const composePhoneValidator = message => value =>
  /** validator does not make field required */
  (!/^\+79[0-9]{9}$/.test(value) ? message : undefined);

export const composeEmailValidator = message => value =>
  /** validator does not make field required */
  (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value) ? message : undefined);


export const composeSlugValidator = message => (value) => {
  /** validator does not make field required */
  if (!value || value.length === 0) return undefined;
  if (value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '').length === 0) return message;
  return undefined;
};

export const composeNumberValidator = (message, { min = null, max = null }) => (value) => {
  /** validator does not make field required */
  const number = parseFloat(value);
  if (isNaN(number)) return undefined;
  if (min !== null && number < min || max !== null && number > max) return message;
  return undefined;
};

export const composeOnlyNumberValidator = ({ typeMessage, sizeMessage }, { min = 0, max = null }) => (value) => {
  /** validator does not make field required */
  const number = +value;
  if (isNaN(number)) return typeMessage;
  if (number < min || max && number > max) return sizeMessage;
  return undefined;
};

export const composeActivityValidator = (message, connectionType) => (value) => {
  if (connectionType !== 2) {
    return undefined;
  }
  if (value.cost && value.id) {
    return undefined;
  }
  return message;
};

export const composeRangeValidator = ({ sizeMessage, typeMessage }, { min = null, max = null }) => (value) => {
  /** validator does not make field required */
  console.log(value);
  if (!value) return undefined;
  if (!(/^[0-9]*$/gm.test(value))) return typeMessage;
  if ((value.length < min || value.length > max) || (value.length > min && value.length < max)) {
    return sizeMessage;
  }
  return undefined;
};

export const docsNumberValidator = ({ sizeMessage, typeMessage }, { min = null, max = null }) => (value) => {
  /** validator does not make field required */
  if (!value) return undefined;
  if (!(/^[0-9]*$/gm.test(value))) return typeMessage;
  if ((value.length < min || value.length > max)) {
    return sizeMessage;
  }
  return undefined;
};

export const composeFirstLetterUppercase = (message) => (value) => {
  return value[0] !== value[0].toUpperCase() ? message : undefined;
};

export const composeChekIfContainPhoneNumber = message => value => {
  return /\d{10,}/.test(value) ? message : undefined;
};

export const composeExlamationPointLimit = message => value => {
  return value && value.split('!').length > 2 ? message : undefined;
};

export const composeCheckIfNotHTML = message => value => {
  return /(<([^>]+)>)/ig.test(value) ? message : undefined;
};

export const composeCheckIfNotEmailSymbol = message => value => {
  return value.includes('@') ? message : undefined;
};

export const composeLastLetterNotDot = (message) => (value) => {
  return value[value.length - 1] === '.' ? message : undefined;
};

export const composeLengthValidator = (message, { min = null, max = null }, valueGetter = passAsIs) => (value) => {
  /** validator does not make field required */
  const val = valueGetter(value);
  if (!val && typeof val !== 'string') return undefined;
  if (min !== null && val.length < min || max !== null && val.length > max) return message;
  return undefined;
};

export const composeArrayRequiredValidator = message => (value) => {
  if (value && value.length) {
    return undefined;
  }
  return message;
};

export const composeOnlineGeoValidator = (message, isOnlineGeoActive) => (value) => {
  if (!isOnlineGeoActive) {
    return undefined;
  }
  if (value && value.length) {
    return undefined;
  }
  const errors = [];
  errors[ARRAY_ERROR] = message;
  return errors;
};

export const isValidUrl = value => urlRegExp.test(value);
const isUrlStartsFromHttp = value => /^(http:\/\/|https:\/\/)/.test(value);
const isValidGooglePlayUrl = value => urlGooglePlayRegExp.test(value);
const isValidAppStoreUrl = value => urlAppStoreRegExp.test(value);

export const composeUrlValidator = message => (value) => {
  /** validator does not make field required */
  if (!value || value.length === 0) return undefined;
  if (!isValidUrl(value)) return message;
  return undefined;
};

export const composeHttpValidator = message => (value) => {
  /** validator does not make field required */
  if (!value || value.length === 0) return undefined;
  if (!isUrlStartsFromHttp(value)) return message;
  return undefined;
};

export const composeUrlWithoutGameServices = message => (value) => {
  if (isValidGooglePlayUrl(value) || isValidAppStoreUrl(value)) return message;
  return undefined;
};

export const composeUrlGooglePlayValidator = message => (value) => {
  if (!isValidUrl(value) || !isValidGooglePlayUrl(value)) return message;
  return undefined;
};

export const composeDenyEntriesFromArray = (message, websitesList) => value => {
  let result;
  websitesList.forEach(item => {
    const webSite = new RegExp(`^(?!.*${item}).*$`);
    if (!webSite.test(value)) {
      result = message;
    }
  });
  return result;
};

export const composeArrayFieldLengthValidator = (message, { minLength }) => (value) => {
  if (value && value.filter(val => val.isActive).length < minLength) {
    // from FF documentation for arrays
    const errors = [];
    errors[ARRAY_ERROR] = message;
    return errors;
  }
  return undefined;
};

export const composeUserInitialsValidator = message => value =>
  /^([а-яА-ЯёЁ ]'?-?)+( [а-яА-ЯёЁ]\s?)*$/.test(value) ? undefined : message;
