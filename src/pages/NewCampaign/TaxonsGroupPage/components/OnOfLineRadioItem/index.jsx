import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { RadioButton } from 'components/fields/_parts';

import styles from './styles.pcss';

export default function OnOfLineRadioItem({ label, value, onChange, isSelected, className, description }) {
  return (
    <div className={classNames(styles.component, isSelected && styles.selected, className)}>
      <RadioButton
        className="button"
        value={value}
        isSelected={isSelected}
        onChange={onChange}
      />

      <div className={styles.textGroup}>
        <span className={styles.label}>{label}</span>

        <span className={styles.description}>{description}</span>
      </div>
    </div>
  );
}

OnOfLineRadioItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  description: PropTypes.string,
};
