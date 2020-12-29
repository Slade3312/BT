import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const LabeledFieldWrapper = ({ children, className }) => (
  <div className={cx('component', className)}>
    {children}
  </div>
);

LabeledFieldWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default LabeledFieldWrapper;
