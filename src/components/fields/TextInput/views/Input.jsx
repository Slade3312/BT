import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';

import styles from '../styles.pcss';

const cx = classNames.bind(styles);


/**
 * Input with visual customization
 */
class InputView extends Component {
  /**
   * we have to override onChange, onFocus and onBlur,
   * normally they fire with event as first argument,
   * we put value as first argument, event as second
   */
  componentDidMount() {
    if (this.props?.focusOnMount && this.props?.forwardedRef?.current) {
      this.props.forwardedRef.current.focus();
    }
  }

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
      classNameInput,
      combined,
      ...otherProps
    } = this.props;

    /**
     * Fields like status and size are passed straight into class, the validation is done in propTypes
     */
    const classes = cx(
      'component',
      size,
      status,
      classNameInput || className,
      combined === 'right' && styles.combinedRight,
    );
    return (
      <input
        autoComplete="on"
        {...otherProps}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={classes}
        ref={forwardedRef}
      />
    );
  }
}


InputView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.oneOf(['fail']),
  size: PropTypes.oneOf(['big', 'default', 'long']),
  className: PropTypes.string,
  classNameInput: PropTypes.string,

  /**
   * some notable default input props are listed here
   * all the other props are simply passed down
   */
  placeholder: PropTypes.string,
  combined: PropTypes.any,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,

  /** is not an actual prop */
  forwardedRef: CustomPropTypes.ref,
};

InputView.defaultProps = {
  type: 'text',
};

export default React.forwardRef((props, ref) => <InputView {...props} forwardedRef={ref} />);
