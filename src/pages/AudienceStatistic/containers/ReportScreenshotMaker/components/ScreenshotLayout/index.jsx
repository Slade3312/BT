import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ScreenshotLayout({ children }) {
  return <div className={cx('component')}>{children}</div>;
}

ScreenshotLayout.propTypes = {
  children: PropsTypes.node,
};
