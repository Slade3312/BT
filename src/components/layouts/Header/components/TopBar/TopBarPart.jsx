import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function TopBarPart({ children, className }) {
  return (
    <div className={cx('part', className)}>
      {children}
    </div>
  );
}

TopBarPart.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
