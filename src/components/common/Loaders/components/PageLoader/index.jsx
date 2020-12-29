import React from 'react';
import PropTypes from 'prop-types';
import Preloader from '../../../Preloader';
import styles from './styles.pcss';

export default function PageLoader({ children, isLoading }) {
  return <div className={styles.component}>{isLoading ? <Preloader /> : children}</div>;
}

PageLoader.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
};
