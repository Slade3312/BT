import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function OptionsItem({ children, className }) {
  return (
    <div className={cx('container', className)}>
      {children}
    </div>

  );
}

OptionsItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
