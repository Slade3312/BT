import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';

import styles from './parts/withError/styles.pcss';

const cx = classNames.bind(styles);


export default function withError(WrappedInput) {
  class InputWithError extends Component {
    render() {
      const {
        forwardedRef,
        status,
        error,
        keepErrorIndent,
        className,
        errorClassName,
        ...otherProps
      } = this.props;

      return (
        <div className={cx('container', className)}>
          <WrappedInput
            {...otherProps}
            ref={forwardedRef}
            status={error ? 'fail' : status}
          />

          {(error && typeof error === 'string' || keepErrorIndent) && <div className={cx('error', errorClassName)}>{error}</div>}
        </div>
      );
    }
  }

  InputWithError.propTypes = {
    /** props added by the HOC */
    status: PropTypes.oneOf(['fail']),
    error: PropTypes.string,
    keepErrorIndent: PropTypes.bool,

    /** props reused by the HOC */
    className: PropTypes.string,
    errorClassName: PropTypes.string,

    /** is not an actual prop */
    forwardedRef: CustomPropTypes.ref,
  };

  InputWithError.defaultProps = {
    // FIXME: should actually position error absolutely, this would fix all the problems with stacking indents
    keepErrorIndent: true,
  };


  /**
   * Override component name by prepending `Contained~`
   * to make it look nice, for example: `ContainedTextInput`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedInput.displayName || WrappedInput.name || 'Input';
    InputWithError.displayName = `Contained${WrappedComponentName}`;
  }

  return withForwardedRef(InputWithError);
}
