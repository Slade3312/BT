import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const FieldLabel = ({ text, tooltip, renderTooltip, className }) => (
  <div className={cx('container', className)}>
    <span className={cx('label')}>
      {text}
    </span>

    {renderTooltip?.()}

    {tooltip && !renderTooltip && (
      <Tooltip>
        {tooltip}
      </Tooltip>
    )}
  </div>
);

FieldLabel.propTypes = {
  text: PropTypes.string,
  tooltip: PropTypes.string,
  renderTooltip: PropTypes.func,
  className: PropTypes.string,
};

export default FieldLabel;
