import React from 'react';
import PropTypes from 'prop-types';
import { isNullOrUndefined } from 'utils/fn';
import withState from '../enhancers/withState';
import MaskedInput from './MaskedInput';

const EMPTY_STRING = '';

/**
 * Input with mask to render number via 3-digit groups
 */
export default class PriceInput extends React.Component {
  /**
   * we use mask dynamically, based on number of symbols
   */
  getMask = () => this.getValueString().split('')
    .map((_, index) => (index % 3 === 0 && index !== 0 ? '_ ' : '_'))
    .reverse()
    .join('');

  getValueWithoutMask = () => this.getValueString().split('')
    .map((_, index) => (index % 3 === 0 && index !== 0 ? '_' : '_'))
    .reverse()
    .join('');

  getValueString = () => {
    const { value } = this.props;
    return !isNullOrUndefined(value) ? value.toString() : '';
  };

  /**
   * Remove all non digits and slice by maxLength
   */
  unmaskNumber = (maskedValue) => {
    const { maxLength } = this.props;
    let value = maskedValue.replace(/\D/g, '');
    if (maxLength) value = value.substring(0, maxLength);
    return value;
  };

  /**
   * onChange should return integer value
   */
  handleChange = (value, event) => {
    const { onChange } = this.props;
    if (onChange) onChange(value === EMPTY_STRING ? EMPTY_STRING : value, event);
  };

  /**
   * we have to override onFocus and onBlur,
   * normally they fire with event as first argument,
   * we add value as second
   */
  handleFocus = (value, event) => {
    const { onFocus } = this.props;
    if (onFocus) onFocus(value, event);
  };

  handleBlur = (value, event) => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(value, event);
  };

  render() {
    return (
      <MaskedInput
        {...this.props}
        /** maxLength is processed in `unmask` above */
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={null}
        mask={this.props.notApplyMask ? this.getValueWithoutMask() : this.getMask()}
        unmaskValue={this.unmaskNumber}
        value={this.getValueString()}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

PriceInput.propTypes = {
  maxLength: PropTypes.number, // controls max number of digits allowed to enter

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
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  notApplyMask: PropTypes.bool,
};

PriceInput.defaultProps = {
  maxLength: 7,
  isClearable: false,
};


/**
 * stateful version accepts all the same propTypes,
 * except for `value`
 */
export const StatefulPriceInput = withState(PriceInput);

StatefulPriceInput.defaultProps = {
  value: null,
};
