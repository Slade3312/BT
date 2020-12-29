import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import FormFieldLabel from '../FormFieldLabel';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function FormField({
  children,
  label,
  isInline,
  isSecondary,
  tooltip,
  description,
  className,
  isNullLabel,
  isLeftLabel,
  isSmallLabel,
  isBase,
  tooltipPositionType,
}) {
  return (
    <div className={cx('container', { inline: isInline, right: isLeftLabel }, className)}>
      {(label || isNullLabel) && (
        <FormFieldLabel
          {...{ tooltip, isSecondary, isSmall: isSmallLabel, isLeftLabel, tooltipPositionType }}
          className={cx('label', { leftLabel: isLeftLabel })}
        >
          <div className={styles.labelContent}>
            <span>{label}</span>
            <span className={styles.description}>{description}</span>
          </div>
        </FormFieldLabel>
      )}
      <div className={cx({ base: isBase })}>{children}</div>
    </div>
  );
}

FormField.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  isInline: PropTypes.bool,
  isSecondary: PropTypes.bool,
  tooltip: PropTypes.node,
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  tooltipPositionType: PropTypes.string,
  isNullLabel: PropTypes.bool,
  isLeftLabel: PropTypes.bool,
  isSmallLabel: PropTypes.bool,
  isBase: PropTypes.bool,
  description: PropTypes.string,
};
