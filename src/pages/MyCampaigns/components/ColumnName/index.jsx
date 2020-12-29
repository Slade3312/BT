import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ColumnName({ children }) {
  return <span className={cx('component')}>{children}</span>;
}

ColumnName.propTypes = {
  children: PropTypes.node,
};
