import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

export default function StrikeThroughText({ children, className }) {
  return (
    <div className={classNames(styles.component, className)}>
      {children}
      <span className={styles.strikethrough} />
    </div>
  );
}

StrikeThroughText.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
