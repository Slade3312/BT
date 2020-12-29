import React from 'react';
import PropTypes from 'prop-types';
import { isNullOrUndefined } from 'utils/fn';
import { MaskedInputWithoutError } from './MaskedInput';

const EMPTY_STRING = '';

/**
 * Input with mask to render number via 3-digit groups
 */
export default class PriceInputWithoutError extends React.Component {
  /**
   * we use mask dynamically, based on number of symbols
   */
  getMask = () => this.getValueString().split('')
    .map((_, index) => (index % 3 === 0 && index !== 0 ? '_ ' : '_'))
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
    if (onChange) onChange(value === EMPTY_STRING ? EMPTY_STRING : parseInt(value, 10), event);
  };

  /**
   * we have to override onFocus and onBlur,
   * normally they fire with event as first argument,
   * we add value as second
   */
  handleFocus = (value, event) => {
    const { onFocus } = this.props;
    if (onFocus) onFocus(parseInt(value, 10), event);
  };

  handleBlur = (value, event) => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(parseInt(value, 10), event);
  };

  render() {
    return (
      <MaskedInputWithoutError
        {...this.props}
        /** maxLength is processed in `unmask` above */
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={null}
        mask={this.getMask()}
        unmaskValue={this.unmaskNumber}
        value={this.getValueString()}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

PriceInputWithoutError.propTypes = {
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
};

PriceInputWithoutError.defaultProps = {
  maxLength: 7,
  isClearable: false,
};

PriceInputWithoutError.defaultProps = {
  value: null,
};
