import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

function CardsContainer({ children }) {
  return (
    <div className={styles.cardsContainer}>
      {React.Children.map(children, (child, key) => (
        <div className={styles.card} key={+key}>{child}</div>
      ))}
    </div>
  );
}

CardsContainer.propTypes = {
  children: PropTypes.node,
};

export default CardsContainer;
