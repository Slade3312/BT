import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Part = ({ children, isClickable, isLast, isOpen }) => (
  <div className={cx('container', { clickable: isClickable, last: isLast, isOpen })}>
    {children}
  </div>
);

Part.propTypes = {
  children: PropsTypes.node,
  isClickable: PropsTypes.bool,
  isLast: PropsTypes.bool,
  isOpen: PropsTypes.bool,
};

export default Part;
