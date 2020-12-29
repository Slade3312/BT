import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ListRowContainer({ className, children }) {
  return <ul className={cx('component', className)}>{children}</ul>;
}

ListRowContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
