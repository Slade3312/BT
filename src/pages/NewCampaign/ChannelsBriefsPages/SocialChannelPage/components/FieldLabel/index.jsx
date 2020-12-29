import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

export default function FieldLabel({ htmlFor, className, children }) {
  return (
    <label htmlFor={htmlFor} className={classNames(styles.label, className)}>{children}</label>
  );
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
