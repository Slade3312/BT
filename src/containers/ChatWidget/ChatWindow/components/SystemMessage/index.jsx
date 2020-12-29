import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.pcss';

function SystemMessage({ text, isError }) {
  return (
    <li className={classNames(styles.message, isError && styles.isError)}>{text}</li>
  );
}

SystemMessage.propTypes = {
  text: PropTypes.string,
  isError: PropTypes.bool,
};

export default SystemMessage;
