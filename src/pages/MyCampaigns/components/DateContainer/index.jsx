import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function DateContainer({ children }) {
  return <div className={cx('component')}>{children}</div>;
}

DateContainer.propTypes = {
  children: PropTypes.node,
};
