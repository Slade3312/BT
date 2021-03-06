import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function SectionSplitLine({ children, className }) {
  return (
    <div className={cx('component', className)}>
      {children}
    </div>
  );
}

SectionSplitLine.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
