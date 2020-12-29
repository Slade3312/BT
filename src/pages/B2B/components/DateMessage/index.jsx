import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

export default function DateMessage({ text }) {
  return (
    <li className={styles.dateMessage}>{text}</li>
  );
}

DateMessage.propTypes = {
  text: PropTypes.string,
};
