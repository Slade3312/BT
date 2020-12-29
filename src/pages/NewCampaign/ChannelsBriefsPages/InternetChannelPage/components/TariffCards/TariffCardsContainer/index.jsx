import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const TariffCardsContainer = ({ children, isDisabled }) => (
  <div className={styles.component}>
    {isDisabled ? (
      <>
        <div className={styles.loader} />
        <div className={styles.wrapper}>{children}</div>
      </>
    ) : (
      <div className={styles.wrapper}>{children}</div>
    )}
  </div>
);

TariffCardsContainer.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default TariffCardsContainer;
