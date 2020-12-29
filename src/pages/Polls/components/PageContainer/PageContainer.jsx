import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.pcss';

function PageContainer({ children }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}

PageContainer.propTypes = {
  children: PropTypes.node,
};

export default PageContainer;
