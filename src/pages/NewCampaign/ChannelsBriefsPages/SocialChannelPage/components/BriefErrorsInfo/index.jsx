import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function BriefErrorsInfo({ items }) {
  return (
    <div className={styles.component}>
      <div className={styles.title}>В запуске кампании отказано по следующей причине:</div>
      {items.map((error) => (
        <div className={styles.item}>{error}</div>
      ))}
    </div>
  );
}

BriefErrorsInfo.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};
