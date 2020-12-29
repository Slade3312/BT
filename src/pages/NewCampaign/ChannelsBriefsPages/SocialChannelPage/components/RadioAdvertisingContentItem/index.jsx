import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function RadioAdvertisingContentItem({ label, subLabel }) {
  return (
    <div className={styles.component}>
      <div>
        {label}
      </div>
      <div className={styles.subTitle}>
        {subLabel}
      </div>
    </div>
  );
}

RadioAdvertisingContentItem.propTypes = {
  label: PropTypes.string,
  subLabel: PropTypes.string,
};
