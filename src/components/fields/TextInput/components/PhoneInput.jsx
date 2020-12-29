import PropTypes from 'prop-types';
import React from 'react';
import { phoneMask } from 'constants/masks';
import withState from '../enhancers/withState';
import MaskedInput from './MaskedInput';


const unmaskValue = (maskedValue = '', prevMaskedValue) => {
  let value = maskedValue.replace(/(^\s*\+7|\D)/g, '');

  /** in special cases we have to do more complicated cleanup actions */
  if (maskedValue.indexOf('+') !== -1 && maskedValue.slice(0, 2) !== '+7') {
    // remove first 7 from the number if something got inserted in between
    value = value.replace(/7/, '');
  } else if (value.length > 10) {
    if (
      /** if field was empty before */
      !prevMaskedValue ||
      /** entire phone is replaced starting with 8 or somebody edits text before input */
      maskedValue[0] !== '+' && value.length === 11 ||
      /** user pasted new value into field when the field had +7 ( in it */
      prevMaskedValue === '+7 '
    ) {
      value = value.slice(value.length - 10);
    } else if (
      /** if user pasted 8(xxx)xxx-xx-xx number into start of the field */
      '78'.indexOf(maskedValue[0]) !== -1 && value.length === 22 ||
      /** user pasted new value into field that had `+7 ` */
      maskedValue.slice(3, 5) === '+7'
    ) {
      // take first number, without leading 8
      value = value.slice(1);
    }
  }
  return value.slice(0, 10);
};

/**
 * Input with mask set up to handle Phone
 */
const PhoneInput = props => {
  return (
    <MaskedInput
      {...props}
      /* TODO: check if tel works */
      type="tel"
      mask={phoneMask}
      unmaskValue={unmaskValue}
    />
  );
};

PhoneInput.propTypes = {
  /** inherited from withError */
  status: PropTypes.oneOf(['fail']),
  error: PropTypes.string,
  keepErrorIndent: PropTypes.bool,

  /** inherited from withIcon */
  Icon: PropTypes.func,
  iconAlt: PropTypes.string,
  isClearable: PropTypes.bool,
  onIconClick: PropTypes.func,
  onClear: PropTypes.func,

  /** inherited from withMask */
  // mask: No longer available,
  // unmaskValue: No longer available,

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  size: PropTypes.oneOf(['big', 'default']),
  // type: No longer available
  placeholder: PropTypes.string,
  value: PropTypes.string, // 10 digit string
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default PhoneInput;


/**
 * stateful version accepts all the same propTypes,
 * except for `value`
 */
export const StatefulPhoneInput = withState(PhoneInput);
