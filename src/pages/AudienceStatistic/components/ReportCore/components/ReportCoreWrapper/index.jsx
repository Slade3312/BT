import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ReportCoreWrapper({ children, isLight }) {
  return <div className={cx('component', { light: isLight })}>{children}</div>;
}

ReportCoreWrapper.propTypes = {
  isLight: PropTypes.bool,
  children: PropTypes.node,
};
