import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';

import styles from './styles.pcss';

export default function TaxonFormLabel({
  tooltip,
  className,
  text,
}) {
  return (
    <label className={classNames(styles.label, className)}>
      <span className={styles.text}>{text}</span>

      {tooltip && <Tooltip>{tooltip}</Tooltip>}
    </label>
  );
}

TaxonFormLabel.propTypes = {
  tooltip: PropTypes.node,
  className: PropTypes.string,
  text: PropTypes.string,
};
