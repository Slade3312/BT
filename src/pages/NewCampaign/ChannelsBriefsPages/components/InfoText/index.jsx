import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { filterValidAttributes } from 'utils/events';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function InfoText({ children, className, ...otherAttributes }) {
  return (
    <div className={cx('component', className)} {...filterValidAttributes(otherAttributes)}>
      {children}
    </div>
  );
}

InfoText.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
