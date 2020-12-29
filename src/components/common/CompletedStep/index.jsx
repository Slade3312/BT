import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const CompletedStep = ({ children, onChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.changeHolder}>
        <button type="button" className={styles.btn} onClick={onChange}>Изменить</button>
      </div>
    </div>
  );
};

CompletedStep.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
};

const Row = ({ children, className }) => (
  <div className={classNames(styles.row, className)}>{children}</div>
);

Row.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export { CompletedStep, Row };
