import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FieldsWidthWrapper({ children, isMax, isMiddle, className }) {
  return <div className={cx('component', { max: isMax, middle: isMiddle }, className)}>{children}</div>;
}

FieldsWidthWrapper.propTypes = {
  children: PropTypes.node,
  isMax: PropTypes.bool,
  isMiddle: PropTypes.bool,
  className: PropTypes.string,
};
