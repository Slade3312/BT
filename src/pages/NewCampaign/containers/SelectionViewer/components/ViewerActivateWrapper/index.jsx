import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ViewerActivateWrapper = ({ onPopupOpen, children, isDisable }) => (
  <div
    onClick={!isDisable ? () => onPopupOpen() : undefined}
    className={cx('container', { disabled: isDisable })}
  >
    {children}
  </div>
);

ViewerActivateWrapper.propTypes = {
  onPopupOpen: PropTypes.func,
  children: PropTypes.node,
  isDisable: PropTypes.bool,
};

export default ViewerActivateWrapper;
