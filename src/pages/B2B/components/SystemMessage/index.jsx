import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

export default function SystemMessage({ text, isError }) {
  return (
    <li className={`${styles.systemMessage} ${isError && styles.error}`}>{text}</li>
  );
}

SystemMessage.propTypes = {
  text: PropTypes.string,
  isError: PropTypes.bool,
};
