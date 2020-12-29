import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function withHovering(WrappedComponent) {
  function Hoverable({ isHoverable, className, ...rest }) {
    return (
      <WrappedComponent
        {...rest}
        className={cx({ hoverable: isHoverable }, className)}
        isHoverable={isHoverable}
      />
    );
  }

  Hoverable.propTypes = {
    ...WrappedComponent.propTypes,
    isHoverable: PropTypes.bool,
  };

  return Hoverable;
}
