import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FormFieldLabel({
  children,
  // please don't add new configuration props (only: small, big, secondary)
  isSmall,
  isBold,
  // TODO: rename isSecondary to more semantic
  isSecondary,
  tooltipPositionType,
  tooltip,
  className,
  classNameContent,
}) {
  return (
    <div className={cx('component', { secondary: isSecondary, small: isSmall, bold: isBold }, className)}>
      <span className={cx('content', classNameContent)}>{children}</span>

      {tooltip && <Tooltip contentPosition={tooltipPositionType}>{tooltip}</Tooltip>}
    </div>
  );
}

FormFieldLabel.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.node,
  isSecondary: PropTypes.bool,
  className: PropTypes.string,
  classNameContent: PropTypes.string,
  isSmall: PropTypes.bool,
  isBold: PropTypes.bool,
  tooltipPositionType: PropTypes.string,
};
