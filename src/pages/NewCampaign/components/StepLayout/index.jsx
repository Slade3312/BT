import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function StepsLayout({ children, className, isStretched }) {
  return (
    <div className={cx('component', { stretched: isStretched }, className)}>
      {children}
    </div>
  );
}

StepsLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isStretched: PropTypes.bool,
};
