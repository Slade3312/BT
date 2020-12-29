import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const PlateRow = ({ children, isColumn, className, isMobile, leftIndent, zeroGrow }) => (
  <div
    className={cx('component', {
      column: isColumn,
      mobile: isMobile,
      zeroGrow,
      leftIndent,
    }, className)}
  >
    {children}
  </div>
);

PlateRow.propTypes = {
  children: PropTypes.node,
  isColumn: PropTypes.bool,
  className: PropTypes.string,
  isMobile: PropTypes.bool,
  leftIndent: PropTypes.bool,
  zeroGrow: PropTypes.bool,
};

export default PlateRow;
