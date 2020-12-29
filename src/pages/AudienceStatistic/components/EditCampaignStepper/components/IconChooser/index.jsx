import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const iconTypes = {
  fail: 'step-icon-types-fail',
  success: 'step-icon-types-success',
};

const getIconSlug = (type) => {
  switch (type) {
    case iconTypes.fail:
      return 'smileFailure';
    case iconTypes.success:
      return 'thumpUp';
    default:
      return null;
  }
};

export default function IconChooser({ className, type }) {
  return (
    <div className={cx('iconRow', className)}>
      <GlobalIcon slug={getIconSlug(type)} className={cx('icon')} />
    </div>
  );
}

IconChooser.propConstants = {
  types: iconTypes,
};

IconChooser.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};
