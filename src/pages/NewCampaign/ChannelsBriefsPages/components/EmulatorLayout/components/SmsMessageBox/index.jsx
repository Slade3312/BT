import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

export default function SmsMessageBox({ children }) {
  return <div className={styles.component}>{children}</div>;
}

SmsMessageBox.propTypes = {
  children: PropTypes.node,
};
