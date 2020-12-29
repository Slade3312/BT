import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';

import styles from './styles.pcss';

const LightText = ({ children, tooltip, className }) => (
  <div className={classNames(styles.text, className)}>
    <span>{children}</span>

    {tooltip && <Tooltip>{tooltip}</Tooltip>}
  </div>
);

LightText.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  className: PropTypes.string,
};

export default LightText;
