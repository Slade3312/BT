import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import CustomPropTypes from 'utils/prop-types';
import withForwardedRef from 'enhancers/withForwardedRef';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const FileUploadInput = ({
  onChange,
  name,
  children,
  forwardedRef,
  onBlur,
  onFocus,
  accept,
  className,
  isMultiple,
  onClick,
}) => (
  <div className={cx('container', className)}>
    <label className={cx('label')} htmlFor={name}>
      {children}

      <input
        id={name}
        name={name}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cx('input')}
        type="file"
        onClick={onClick}
        onChange={onChange}
        ref={forwardedRef}
        accept={accept}
        multiple={isMultiple}
      />
    </label>
  </div>
);

FileUploadInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  forwardedRef: CustomPropTypes.ref,
  name: PropTypes.string,
  accept: PropTypes.string,
  className: PropTypes.string,
  isMultiple: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withForwardedRef(FileUploadInput);
