import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function TextContent({ children }) {
  return (
    <p className={cx('content')}>{children}</p>
  );
}

TextContent.propTypes = {
  children: PropTypes.node,
};
