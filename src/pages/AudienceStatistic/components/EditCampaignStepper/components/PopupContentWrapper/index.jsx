import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function PopupContentWrapper({ children, className }) {
  return (
    <div className={cx('content', className)}>{children}</div>
  );
}

PopupContentWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
