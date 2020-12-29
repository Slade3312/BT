import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

export default function NotificationMessageBox({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}

NotificationMessageBox.propTypes = {
  children: PropTypes.node,
};
