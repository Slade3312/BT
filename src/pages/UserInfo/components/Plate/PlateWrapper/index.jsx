import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);


const topIndentTypes = {
  normal: Symbol('plate-wrapper-normal'),
  small: Symbol('plate-wrapper-small'),
};

const PlateWrapper = ({ children, isMobile, isColumn, topIndentType, isCompact, isPrioritized, className }) => (
  <div
    className={cx('component', {
      column: isColumn,
      mobile: isMobile,
      topIndentNormal: topIndentType === topIndentTypes.normal,
      topIndentSmall: topIndentType === topIndentTypes.small,
      compact: isCompact,
      prioritized: isPrioritized,
    }, className)}
  >
    {children}
  </div>
);

PlateWrapper.propConstants = {
  topIndentTypes,
};

PlateWrapper.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  isColumn: PropTypes.bool,
  topIndentType: PropTypes.oneOfType([PropTypes.symbol, PropTypes.bool]),
  isCompact: PropTypes.bool,
  isPrioritized: PropTypes.bool,
  className: PropTypes.string,
};

export default PlateWrapper;
