import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { BeautyScrollbar } from 'components/common';
import styles from './styles.pcss';


const FullScreenModal = ({ children }) => {
  return (
    <BeautyScrollbar className={`${styles.fullScreenModal} ${styles.opened}`}>
      <div className={styles.container}>
        {children}
      </div>
    </BeautyScrollbar>
  );
};

FullScreenModal.propTypes = {
  children: PropTypes.node,
};

export default observer(FullScreenModal);
