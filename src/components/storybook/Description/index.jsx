import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Description({ children }) {
  return <div className={cx('component')} >{children}</div>;
}

Description.propTypes = {
  children: PropTypes.node,
};
