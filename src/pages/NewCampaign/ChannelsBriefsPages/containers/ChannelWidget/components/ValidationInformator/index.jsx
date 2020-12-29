import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function ValidationInformator({ text }) {
  return <div className={styles.component}>{text}</div>;
}


ValidationInformator.propTypes = {
  text: PropTypes.string,
};
