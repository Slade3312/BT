import React from 'react';
import PropTypes from 'prop-types';
import { GlobalIcon } from 'components/common';
import styles from './styles.pcss';


const PseudoButton = ({ children }) => (
  <div className={styles.choosen}>
    <GlobalIcon slug="checked" className={styles.choosenIcon} />
    {children}
  </div>
);

PseudoButton.propTypes = {
  children: PropTypes.any,
};

export default PseudoButton;
