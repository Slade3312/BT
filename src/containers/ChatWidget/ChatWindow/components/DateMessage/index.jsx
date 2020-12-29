import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.pcss';

function DateMessage({ text, isFirst }) {
  return (
    <li className={classNames(styles.message, isFirst && styles.first)}>{text}</li>
  );
}

DateMessage.propTypes = {
  text: PropTypes.string,
  isFirst: PropTypes.bool,
};

export default DateMessage;
