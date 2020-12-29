import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';

import styles from '../styles.pcss';

const cx = classNames.bind(styles);


/**
 * Input with visual customization
 */
class TextAreaView extends Component {
  clear = () => this.props.onChange('');

  /**
   * we have to override onChange, onFocus and onBlur,
   * normally they fire with event as first argument,
   * we put value as first argument, event as second
   */
  handleChange = (event) => {
    const { onChange } = this.props;
    if (onChange) onChange(event.target.value, event);
  };

  handleFocus = (event) => {
    const { onFocus, value } = this.props;
    if (onFocus) onFocus(value, event);
  };

  handleBlur = (event) => {
    const { onBlur, value } = this.props;
    if (onBlur) onBlur(value, event);
  };

  render() {
    const {
      size,
      status,
      className,
      forwardedRef,
      rows,
      ...otherProps
    } = this.props;

    /**
     * Fields like status and size are passed straight into class, the validation is done in propTypes
     */
    const classes = cx(
      'component',
      'textarea',
      size,
      status,
      className,
    );
    return (
      <textarea
        {...otherProps}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={classes}
        ref={forwardedRef}
        rows={rows || 5}
      />
    );
  }
}


TextAreaView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.oneOf(['fail']),
  size: PropTypes.oneOf(['big', 'default']),
  className: PropTypes.string,

  /**
   * some notable default props are listed here
   * all the other props are simply passed down
   */
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  rows: PropTypes.any,

  /** is not an actual prop */
  forwardedRef: CustomPropTypes.ref,
};

export default React.forwardRef((props, ref) => <TextAreaView {...props} forwardedRef={ref} />);
